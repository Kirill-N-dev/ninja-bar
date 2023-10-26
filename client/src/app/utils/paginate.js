export function paginate(items, pageNumber, pageSize) {
    // Усовершенствованная функция - избегаю её выполнения для не массивов, т.к пагинация толькго для них
    /* console.log("from paginate function: items", items); */
    if (items && Array.isArray(items) && pageNumber && pageSize) {
        const startIndex = (pageNumber - 1) * pageSize;
        // Ниже возврат удалённого, его и будем выводить как айтемы
        return [...items].splice(startIndex, pageSize);
    } else {
        return false;
    }
}
