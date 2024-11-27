import React, { useContext, useState } from 'react'
import { ToastContext } from '../../context/toast/ToastContext';
// UI
import { classNames } from "primereact/utils";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
// OTROS
import { useForm } from "react-hook-form";
import moment from "moment";
// UTILS
import { formDate, propsCalendar } from '../../utils/utils';
import { axiosApi } from '../../api/axiosApi';

export const DialogEvent = ({ item=null, onClose, addItem, updateItem }) => {

    const defaultValues = { 
        nombre: item?.nombre || "",
        descripcion: item?.descripcion || "",
        fecha: item?.fecha || new Date(),
        cupo: item?.cupo || ""
    };

    const { showSuccess, showError } = useContext(ToastContext);
    const { register, handleSubmit, watch, reset, formState: { errors }, } = useForm({ defaultValues });

    const saveEvent = async (values) => {
        try {
            const { data } = await axiosApi.post('/api/eventos:', values);
            showSuccess(data.mensaje);            
            addItem({...values, id: data.id, fecha: moment(values.fecha).format("YYYY-MM-DD")});
            onClose()
        } catch (error) {
            console.log(error)
            if (error.response) {
                if (error.response.status === 404) return showError('Api no encontrada');
                return showError(error.response?.data.mensaje);
            }    
            showError(error);
        }
    };

    const updateEvent = async (values) => {
        try {
            const { data } = await axiosApi.put('/api/eventos', {...values, id: item.id });
            showSuccess(data.mensaje);            
            updateItem({...values, id: item.id, fecha: moment(values.fecha).format("YYYY-MM-DD")});
            onClose()
        } catch (error) {
            console.log(error)
            if (error.response) {
                if (error.response.status === 404) return showError('Api no encontrada');
                return showError(error.response?.data.mensaje);
            }    
            showError(error);
        }
    };

    return (
        <Dialog
            // maximizable={true}
            draggable
            header={item ? `Edición Evento` : "Nuevo Evento"}
            visible={true}
            onHide={() => { reset(defaultValues); onClose() }}
            breakpoints={{ "1584px": "80vw", "960px": "60vw", "672px": "100vw" }}
            style={{ width: "50vw" }}
            footer={
                item ? (
                    <Button
                        className="p-button-info"
                        onClick={handleSubmit(updateEvent)}
                        label="Guardar Cambios"
                    />
                ) : (
                    <Button
                        className="p-button-info"
                        onClick={handleSubmit(saveEvent)}
                        label="Guardar"
                    />
                )
            }
        >
            <form>
                <div className="grid p-fluid">
                    <div className="col-12 md:col-6">
                        <label>Nombre:</label>
                        <InputText
                            placeholder="Nombre"
                            className={classNames({ "p-invalid": errors.nombre })}
                            {...register("nombre", { required: "El campo nombre es requerido" })}
                        />
                        <div className={classNames({ "p-error": errors.nombre })}> {errors.nombre?.message}</div>
                    </div>
                    <div className="col-12 md:col-6">
                        <label>Descripción:</label>
                        <InputTextarea
                            rows={1}
                            autoResize
                            placeholder="Descripción"
                            {...register("descripcion")}
                        />
                    </div>
                    <div className="col-12 md:col-6">
                        <label>Fecha:</label>
                        <Calendar {...propsCalendar}
                            value={formDate(watch("fecha"))}
                            className={classNames({ "p-invalid": errors.fecha })}
                            {...register("fecha", { required: "El campo fecha es requerido" })}
                        />
                    </div>
                    <div className="col-12 md:col-6">
                        <label>Cupo:</label>
                        <InputText
                            keyfilter="int"
                            placeholder="Cupo"
                            className={classNames({ "p-invalid": errors.cupo })}
                            {...register("cupo", { required: "El campo cupo es requerido" })}
                        />
                        <div className={classNames({ "p-error": errors.cupo })}> {errors.cupo?.message}</div>
                    </div>
                </div>
            </form>
        </Dialog>
    )
}
