// Вынес для регистрации и изменения данных через меню
export const validatorConfig = {
    name: {
        isRequired: {
            message: "Укажите имя"
        },
        min: {
            message: `Имя должно иметь от 2 символов`,
            value: 2
        }
    },
    surname: {
        isRequired: {
            message: "Укажите вашу фамилию"
        },
        min: {
            message: `Фамилия должна иметь от 2 символов`,
            value: 2
        }
    },
    patronymic: {
        isRequired: {
            message: "Укажите ваше отчество"
        },
        min: {
            message: `Отчество должно иметь от 2 символов`,
            value: 2
        }
    },
    phone: {
        isRequired: {
            message: "Укажите ваш телефон"
        },
        isNumber: {
            message: "Только цифры"
        },
        min: {
            message: `Телефон должен иметь от 5 цифр`,
            value: 5
        }
    },
    password: {
        isRequired: {
            message: "Пароль обязателен для заполнения"
        },
        isCapitalSymbol: {
            message: "Пароль должен содержать хотя бы одну заглавную букву"
        },
        isContainDigit: {
            message: "Пароль должен содержать хотя бы одну цифру"
        },
        min: {
            message: `Пароль должен содержать от 8 символов`,
            value: 8
        }
    },
    sex: {
        isRequired: {
            message: "Укажите ваш пол"
        }
    },
    region: {
        isRequired: {
            message: "Укажите вашу область"
        },
        min: {
            message: `В названии области должно быть от 2 букв`,
            value: 2
        }
    },
    city: {
        isRequired: {
            message: "Укажите ваш город"
        },
        min: {
            message: `В названии города должно быть от 2 букв`,
            value: 2
        }
    },
    street: {
        isRequired: {
            message: "Укажите адрес для доставки"
        },
        min: {
            message: `В названии улицы должно быть от 2 букв`,
            value: 2
        }
    },
    apartment: {
        isRequired: {
            message:
                "Укажите номер квартиры или иной идентификатор помещения для доставки"
        }
    },

    license: {
        isRequired: {
            message:
                "Вы не можете использовать сервис без принятия лицензионного соглашения"
        }
    },
    price: {
        isRequired: {
            message: "Укажите цену"
        },
        isNumber: {
            message: "Только цифры"
        }
    },
    weight: {
        isRequired: {
            message: "Укажите вес"
        },
        isNumber: {
            message: "Только цифры"
        }
    },
    ingredients: {
        isRequired: {
            message: "Укажите состав"
        }
    },
    img_url: {
        isRequired: {
            message: "Добавьте ссылки на фото товара"
        },
        isLastComma: { message: "После запятой обязательно укажите ссылку" },
        isLastSpace: { message: "После ссылки не должно быть пробелов" }
    },
    desc: {
        isRequired: {
            message: "Добавьте описание"
        }
    },
    type: {
        isRequired: {
            message: "Выберите тип"
        }
    }
};
