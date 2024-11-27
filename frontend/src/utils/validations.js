export const isValidEmail = (email) => {
    const match = String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );

    return !!match;
};

export const isEmail = (email) => {
    if (!email) "El campo correo es requerido";
    return isValidEmail(email) ? undefined : "Correo invalido. E.j. example@email.com";
};

