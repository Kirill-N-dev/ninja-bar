import React from "react";
import oven from "../../../media/aboutUs/oven-2.jpg";
import ingr from "../../../media/aboutUs/ingredients-3.jpg";
import deliv from "../../../media/aboutUs/delivery-1.jpg";
import cook from "../../../media/aboutUs/cook-1.jpg";

const AboutUs = () => {
    const content = [
        {
            src: oven,
            title: "Итальянская печь",
            p1: "Благодаря настоящей итальянской печи пицца получается хрустящей снаружи и сочной внутри, а сыр приобретает аппетитный румянец."
        },
        {
            src: ingr,
            title: "Уникальные ингредиенты",
            p1: "Мы используем лучшие итальянсие сорта сыра, такие как моцарелла и пармезан, обладающие особой консистенцией и уникальным вкусом.",
            p2: "Гриб цезарь является дорогим деликатесом, и в сочетании с шампиньонами и лисичками придаёт пицце неповторимый вкус.",
            p3: "Томаты черри обладают ярким ароматом, что делает нашу пиццу ещё вкуснее."
        },
        {
            src: cook,
            title: "Лучшие повара",
            p1: "Имея за плечами большой опыт в европейской кухне наши повара делают самую вкусную пиццу в нашем городе.",
            p2: "Они прошли многолетнее обучение и работают с самыми свежими продуктами, и пицца получается просто великолепной!"
        },
        {
            src: deliv,
            title: "Быстрая доставка",
            p1: "Благодаря современным видам мобильного транспорта наши курьеры доставят вам пиццу в кратчайшие сроки.",
            p2: "Наши курьеры - лучшие из лучших, потому что мы ценим наших клиентов."
        }
    ];
    return (
        <div className="container mt-4 flex-grow-1">
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {content.map((i) => {
                    return (
                        <div className="col" key={i.src}>
                            <div className="card h-100 border-0 mb-2">
                                <img
                                    src={i.src}
                                    className="card-img-top"
                                    alt={i.title}
                                />
                                <div className="card-body">
                                    <h4 className="card-title text-center mb-4">
                                        {i.title}
                                    </h4>
                                    {i.p1 ? (
                                        <p className="card-text">{i.p1}</p>
                                    ) : null}
                                    {i.p2 ? (
                                        <p className="card-text">{i.p2}</p>
                                    ) : null}
                                    {i.p3 ? (
                                        <p className="card-text">{i.p3}</p>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AboutUs;
