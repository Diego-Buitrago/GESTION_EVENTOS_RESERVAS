import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ToastContext } from '../../context/toast/ToastContext';
// UI
import { Card } from 'primereact/card';        
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
// UTILS
import { propsDataTable, propsSelect, statusReservation } from '../../utils/utils';
import { axiosApi } from '../../api/axiosApi';
// COMPONENTES
import { DialogReservation } from '../reservations';

export const Reservations = ({ idEvento }) => {
    
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
    const [filter, setFilter] = useState("");
    // VENTANA NUEVO EVENTO
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setLoading(true);

        const params = { estado: filter, idEvento, ...pagination};

        axiosApi.get('/api/reservas', { params: params })
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
    }, [filter, idEvento, pagination])     
    
    const updateBooking = async (id, estado) => {
        try {

            const params = { id, estado };

            const { data } = await axiosApi.put('/api/reservas', params);
            showSuccess(data.mensaje);  

            setData(prev => {
                const _data = [...prev];
                const index = _data.findIndex((x) => x.id === id);
                _data[index].estado = estado;
                return _data;
            });
        } catch (error) {
            console.log(error)
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

    const headerTemplate = useMemo(() => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
                <Dropdown
                    {...propsSelect}
                    value={filter}
                    options={statusReservation}     
                    style={{ width: "100%" }}  
                    placeholder='Filtrar'
                    onChange={({ value }) => setFilter(value)}            
                />
            </div>           
            <div>Reservas</div>
            <div style={{ flexShrink: 0 }}>
                <Button
                    className="p-button-xs"
                    icon="pi pi-plus"
                    iconPos="right"
                    label="Nueva Reserva"
                    onClick={() => setVisible(true)}
                />
            </div>
        </div>
    ), [filter]);

    const columnsConfig = [
        {
            field: "nombre", header: "Nombre", sortable: true, style: { flexGrow: 1, flexBasis: "10rem", minWidth: "20rem" }
        },
        {
            field: "email", header: "Email", sortable: true, style: { flexGrow: 1, flexBasis: "10rem", minWidth: "10rem" }
        },
        {
            field: "numero", header: "Plazas", sortable: true, style: { flexGrow: 1, flexBasis: "6rem", minWidth: "6rem" }
        },
        {
            field: "estado", header: "estado", sortable: true, style: { flexGrow: 1, flexBasis: "5rem", minWidth: "5rem" },
            body: ({id, estado }) => {
                return (
                    <Dropdown
                        {...propsSelect}
                        value={estado}
                        options={statusReservation}
                        showClear={false}     
                        style={{ width: "100%" }} 
                        optionDisabled={({ value }) => value === "pendiente"}  
                        onChange={({ value }) => updateBooking(id, value)}            
                    />
                )
            }  
        },
    ]

    return (
        <div className='mt-3'>
             {
                visible && (
                    <DialogReservation 
                        idEvento={idEvento}
                        onClose={() => { setVisible(false); }} 
                        addItem={addItem}
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
                </DataTable>
            </Card>
        </div>
    )
}
