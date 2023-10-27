import httpService from "../services/httpService";

const goodsEndpoint = "/goods/";

const goodsService = {
    // Из респонса получим лишь data - тело ответа сервера (что мы запрашивали)
    get: async () => {
        const { data } = await httpService.get(goodsEndpoint);
        return data;
    },
    getById: async (gid) => {
        const { data } = await httpService.get(goodsEndpoint + gid);
        /* console.log("AAAAAAAAAA gid", data); */
        return data;
    },
    // Сортировка на сервере. Данный метод только для майнпаги. После допила метода filter можно заменить.
    sort: async (order) => {
        // Был многочасовой баг, неверно передавал квери параметры, без скобок, переменной
        /* console.log("пэйлод", order); */
        const params = order ? { sortB: `${order}` } : {};
        const { data } = await httpService.get(goodsEndpoint, {
            params: {
                params
            }
        });
        return data;
    },
    // Фильтрация на сервере. Включает возможную сортировку для отфильтрованных страниц.
    filter: async (name, sort) => {
        /*  console.log("name ", name, "sort ", sort); */
        const params =
            name || sort ? { filterBy: `${name}`, sortBy: `${sort}` } : {};
        const { data } = await httpService.get(goodsEndpoint, {
            params: {
                params
            }
        });
        return data;
    },
    // Изменение товара
    change: async (payload) => {
        const { gid } = payload;
        const { data } = await httpService.patch(goodsEndpoint + gid, payload);
        return data;
    },
    // Создание товара
    create: async (payload) => {
        const { data } = await httpService.post(
            goodsEndpoint + "create",
            payload
        );
        return data;
    },
    // Удаление товаров продавцом
    delete: async (payload) => {
        /* с Administration - goods - передаю
        { isLoggedInUser: "652042eb8e3c74e80b4f890e", idsForDelete: (2) [id,id...] } */
        console.log(
            "payload перед отправкой на удаление",
            payload.idsForDelete,
            payload.idsForDelete.length
        ); // +++
        const { isLoggedInUser } = payload;
        const params = payload.idsForDelete.length
            ? { idsForDelete: payload.idsForDelete }
            : {};
        const { data } = await httpService.delete(
            goodsEndpoint + isLoggedInUser,
            {
                params: {
                    params
                }
            }
        );
        return data;
    }
};

export default goodsService;
