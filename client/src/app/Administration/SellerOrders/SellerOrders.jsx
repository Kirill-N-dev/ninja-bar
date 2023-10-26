import React from "react";

const SellerOrders = () => {
    return (
        <div className="d-flex justify-content-center">
            <div
                className="container mt-3 d-flex flex-column"
                style={{ maxWidth: "800px" }}
            >
                <p>
                    Данный сайт является альфа версией проекта. Данный раздел
                    находится в разработке.
                </p>
                <p className="mb-3">В дальнейшем будет реализована:</p>
                <ol className="list-group list-group-flush mb-3">
                    <li className="list-group-item">
                        - Сущность заказов, которая будет формироваться при
                        нажатии &apos;Оформить заказ&apos;
                    </li>
                    <li className="list-group-item">
                        - Будет усовершенствована корзина, чтобы кнопка
                        &apos;Оформить заказ&apos; была фиксированной и
                        адаптивной одновременно
                    </li>
                    <li className="list-group-item">
                        - Будет оптимизован стор путём переноса операций с
                        корзиной на сервер
                    </li>
                    <li className="list-group-item">
                        - Данные о заказе будут доступны как продавцу, так и
                        покупателям
                    </li>
                </ol>

                <p>Следите за обновлениями!</p>
                <p className="fs-4 align-self-center">🙂</p>
            </div>
        </div>
    );
};

export default SellerOrders;
