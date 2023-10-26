export const validator = (data, config) => {
    //
    const errors = {};
    //
    function validate(validateMethod, data, config) {
        let statusValidate;
        switch (validateMethod) {
            case "isRequired": {
                if (typeof data === "boolean") {
                    statusValidate = !data;
                } else {
                    statusValidate = data.toString().trim() === ""; // добавил для чисел в текстфилде, иначе трим не работает
                }
                break;
            }
            case "isEmail": {
                const emailRegExp = /^\S+@\S+\.\S+$/g;
                statusValidate = !emailRegExp.test(data);
                break;
            }
            case "isCapitalSymbol": {
                const capitalRegExp = /[A-Z]/g;
                statusValidate = !capitalRegExp.test(data);
                break;
            }
            case "isContainDigit": {
                const digitRegExp = /\d+/g;
                statusValidate = !digitRegExp.test(data);
                break;
            }
            case "min": {
                statusValidate = data.length < config.value;
                break;
            }
            case "isNumber": {
                const onlyNums = /^[0-9]+$/g; // писал сам, по калькам
                statusValidate = !onlyNums.test(data);
                break;
            }
            case "isLastComma": {
                const noLastComma = /,$/gm; // писал сам, по калькам (но убрал !, иначе был глюк)
                statusValidate = noLastComma.test(data);
                break;
            }
            case "isLastSpace": {
                const noLastSpace = / $/gm; // писал сам, по калькам (но убрал !, иначе был глюк)
                statusValidate = noLastSpace.test(data);
                break;
            }
            default:
                break;
        }
        if (statusValidate) return config.message;
    }
    //
    for (const fieldName in data) {
        for (const validateMethod in config[fieldName]) {
            //
            const error = validate(
                validateMethod,
                data[fieldName],
                config[fieldName][validateMethod]
            );
            if (error && !errors[fieldName]) {
                errors[fieldName] = error;
            }
        }
    }
    return errors;
};
