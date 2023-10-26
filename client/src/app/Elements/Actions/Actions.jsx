import React from "react";

const Actions = () => {
    const content = [
        { title: "5% OFF", p: "При заказе от 5000р", class: "borderColor1" },
        { title: "10% OFF", p: "При заказе от 10000р", class: "borderColor2" },
        {
            title: "15% OFF",
            p: (
                <span>
                    Мы ценим постоянных клиентов.
                    <br />
                    При сумме заказов от 50000 вы получаете 15% скидку!
                </span>
            ),
            class: "borderColor3"
        }
    ];
    return (
        <div className="container mt-4 flex-grow-1">
            <p className="mb-4 ">
                Уважаемые покупатели, раздел постоянно обновляется. Следите за
                нашими обновлениями!
            </p>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-4">
                {content.map((i) => {
                    return (
                        <div className="col" key={i.class}>
                            <div
                                className={
                                    "card" + " " + "mb-3" + " " + i.class
                                }
                                style={{ minWidth: "17vw" }}
                                data-bs-toggle="collapse"
                                href={"#" + i.class}
                                role="button"
                                aria-expanded="false"
                                aria-controls={i.class}
                            >
                                <div className="card-body d-flex flex-column justify-content-evenly">
                                    <h4 className="card-title text-center">
                                        {i.title}
                                    </h4>
                                    <p
                                        className="card-text text-center collapse"
                                        id={i.class}
                                    >
                                        {i.p}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Actions;
