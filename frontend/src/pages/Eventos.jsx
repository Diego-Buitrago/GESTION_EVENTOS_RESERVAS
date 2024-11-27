import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ToastContext } from '../context/toast/ToastContext';
// UI
import { Card } from 'primereact/card';        
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
// COMPONENTES
import { DialogEvent } from '../components/events/DialogEvent';
// UTILS
import { propsDataTable } from '../utils/utils';
import { axiosApi } from '../api/axiosApi';

const columnsConfig = [
    {
        field: "nombre", header: "Nombre", sortable: true, style: { flexGrow: 1, flexBasis: "10rem", minWidth: "20rem" }
    },
    {
        field: "descripcion", header: "Descripción", sortable: true, style: { flexGrow: 1, flexBasis: "15rem", minWidth: "15rem" }
    },
    {
        field: "fecha", header: "Fecha", sortable: true, style: { flexGrow: 1, flexBasis: "6rem", minWidth: "6rem" }
    },
    {
        field: "cupo", header: "Cupo", sortable: true, style: { flexGrow: 1, flexBasis: "5rem", minWidth: "5rem" }
    },
]

const Eventos = () => {

    const { showError, showSuccess } = useContext(ToastContext);

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pagination, setPagination] = useState({
        rows: 20,
        first: 0,
        sortField: "nombre",
        sortOrder: 1,
    });
     // VENTANA NUEVO EVENTO
     const [visible, setVisible] = useState(false);
     const [item, setItem] = useState(null);

    useEffect(() => {
        setLoading(true);

        const params = {...pagination}

        axiosApi.get('/api/get_events', { params: params })
        .then(({ data }) => {
            const { results, total } = data;
            setLoading(false);
            setData(results);
            if (pagination.first === 0) setTotalRecords(total);
        }).catch(error => {
            console.log(error)
            setLoading(false);
            if (error.response) {
                if (error.response.status === 404) return showError('Api no encontrada');
                return showError(error.response?.data.mensaje);
            }    
            showError(error);
        })
    }, [pagination])   

    const deleteEvent = async (id) => {
        try {
            const { data } = await axiosApi.delete('api/delete_event', { params: {id} });

            showSuccess(data.mensaje);
            setTotalRecords(totalRecords - 1);
            setData(prev => prev.filter(x => x.id !== id));
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) return showError('Api no encontrada');
                return showError(error.response?.data.mensaje);
            }    
            showError(error);
        }
    }

    const addItem = useCallback((item) => {
        setData(prev => prev.concat(item));
        setTotalRecords(totalRecords + 1);
    }, [totalRecords])

    const updateItem = useCallback((item) => {
        console.log(item)
        setData(prev => {
            const _data = [...prev];
            const index = _data.findIndex((x) => x.id === item.id);
            console.log({_data})
            _data[index] = item;
            return _data;
        });
    }, [])

    const renderActions = (item) => {
        const { id, nombre } = item;

        return (
            <div className="actions">              
                <Button
                    onClick={() => { setVisible(true); setItem(item); }}
                    className="p-button-rounded p-button-warning mr-1"
                    title={`Modificar Evento ${nombre}`}
                    icon="pi pi-pencil"
                />
                <Button
                    className="p-button-rounded p-button-danger p-button-xs mr-1"
                    icon="pi pi-trash"
                    title={`Eliminar Evento ${nombre}`}
                    onClick={(e) =>
                        confirmPopup({
                            target: e.currentTarget,
                            acceptLabel: "Si",
                            message: `Realmente desea eliminar el evento ${nombre}?`,
                            icon: "pi pi-exclamation-triangle",
                            acceptClassName: "p-button-danger",
                            accept: () => deleteEvent(id),
                        })
                    }
                />
            </div>
        );
    }

    const headerTemplate = useMemo(() => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div></div>           
            <div >Eventos</div>
            <div style={{ flexShrink: 0 }}>
                <Button
                    className="p-button-xs"
                    icon="pi pi-plus"
                    iconPos="right"
                    label="Nuevo Evento"
                    onClick={() => setVisible(true)}
                />
            </div>
        </div>
    ), []);

    return (
        <div style={{ marginTop: 13 }}>
            <ConfirmPopup />
            {
                visible && (
                    <DialogEvent 
                        item={item} 
                        onClose={() => { setItem(null); setVisible(false); }} 
                        addItem={addItem}
                        updateItem={updateItem}
                    />
                )
            }
            <Card>
                <DataTable
                    {...propsDataTable}
                    dataKey="id"
                    value={data}
                    loading={loading}
                    scrollHeight={window.innerHeight - 320}
                    totalRecords={totalRecords}
                    header={headerTemplate}
                    rows={pagination.rows}
                    first={pagination.first}
                    sortOrder={pagination.sortOrder}
                    sortField={pagination.sortField}
                    onPage={(event) => setPagination((prev) => ({ ...prev, rows: event.rows, first: event.first }))}
                    onSort={(e) => setPagination((prev) => ({ ...prev, sortField: e.sortField, sortOrder: e.sortOrder }))}
                >
                    {
                        columnsConfig.map(props => <Column key={props.field} {...props} />)
                    }
                    <Column frozen alignFrozen="right" style={{ flexGrow: 1, flexBasis: "8rem", maxWidth: "8rem", minWidth: "8rem" }} align="center"
                        body={renderActions}
                    />
                </DataTable>
            </Card>
        </div>
    )
}

export default Eventos