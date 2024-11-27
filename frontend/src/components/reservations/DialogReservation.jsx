import React, { useContext } from 'react'
import { ToastContext } from '../../context/toast/ToastContext';
// UI
import { classNames } from "primereact/utils";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
// OTROS
import { useForm } from "react-hook-form";
// UTILS
import { isEmail } from '../../utils/validations';
import { axiosApi } from '../../api/axiosApi';

const defaultValues = { nombre: "", email: "", numero: "" };

export const DialogReservation = ({ idEvento, onClose, addItem }) => {

    const { showSuccess, showError } = useContext(ToastContext);
    const { register, handleSubmit, reset, formState: { errors }, } = useForm({ defaultValues });

    const saveBooking = async (values) => {
        try {

            const params = { idEvento, ...values }

            const { data } = await axiosApi.post('/api/reservas', params);
            showSuccess(data.mensaje);            
            addItem({id: data.id, estado: "pendiente", ...values });
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
            header="Nueva Reserva"
            visible={true}
            onHide={() => { reset(defaultValues); onClose() }}
            breakpoints={{ "1584px": "80vw", "960px": "60vw", "672px": "100vw" }}
            style={{ width: "50vw" }}
            footer={
                <Button
                    className="p-button-info"
                    onClick={handleSubmit(saveBooking)}
                    label="Guardar"
                />
            }
        >
            <form>
                <div className="grid p-fluid">
                    <div className="col-12 md:col-6">
                        <label>Nombre Usuario:</label>
                        <InputText
                            placeholder="Nombre Usuario"
                            className={classNames({ "p-invalid": errors.nombre })}
                            {...register("nombre", { required: "El campo nombre usuario es requerido" })}
                        />
                        <div className={classNames({ "p-error": errors.nombre })}> {errors.nombre?.message}</div>
                    </div>
                    <div className="col-12 md:col-6">
                        <label>Correo Electrónico:</label>
                        <InputText
                            rows={1}
                            autoResize
                            placeholder="Correo Electrónico"
                            className={classNames({ "p-invalid": errors.email })}
                            {...register("email", { validate: isEmail })}
                        />
                        <div className={classNames({ "p-error": errors.email })}> {errors.email?.message}</div>
                    </div>
                    <div className="col-12 md:col-6">
                        <label>Numero de plazas:</label>
                        <InputText
                            keyfilter="int"
                            placeholder="Numero de Plazas"
                            className={classNames({ "p-invalid": errors.numero })}
                            {...register("numero", { 
                                required: "El campo numero de plazas es requerido",
                                min: { message: "El valor mínimo debe ser 1", value: 1 },
                            })}
                        />
                        <div className={classNames({ "p-error": errors.numero })}> {errors.numero?.message}</div>
                    </div>
                </div>
            </form>
        </Dialog>
    )
}
