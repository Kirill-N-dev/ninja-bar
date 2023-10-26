/* eslint-disable */

const iObserver = () => {
    var options = {
        /* root: null,
          rootMargin: "0px", */
        threshold: 1
    };

    var btn = document.querySelector(".upper");
    var sub_btn_1 = document.querySelector(".upper_1");
    var sub_btn_2 = document.querySelector(".upper_2");

    var imgAll = document.querySelectorAll("img");
    var img = imgAll[0];

    var callback = function (entries) {
        entries.forEach((entry) => {
            // intersectionRatio - фактическое пересечение, 0-1
            if (entry.intersectionRatio >= 0) {
                // От вьюпорта сверху до границы таргета
                let a = img.getBoundingClientRect().top;

                // Проскролено
                let c = window.scrollY;

                var line_1 = document.querySelector(".upper_1");
                var line_2 = document.querySelector(".upper_2");
                // c > a + c - когда a становится отрицательной (таргет на линии вьюпорта)
                if (c > a + c) {
                    btn.classList.add("upper_visible");
                    line_1.classList.add("upper_1_vsb");
                    line_2.classList.add("upper_2_vsb");
                } else {
                    btn.classList.remove("upper_visible");
                    line_1.classList.remove("upper_1_vsb");
                    line_2.classList.remove("upper_2_vsb");
                }
            }
        });
    };

    var observer = new IntersectionObserver(callback, options);
    observer.observe(img);

    ////////////////////////////////////////////////////////

    btn.addEventListener("click", (ev) => {
        btn.classList.remove("upper_visible");
        sub_btn_1.classList.remove("upper_1_vsb");
        sub_btn_2.classList.remove("upper_2_vsb");
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    });
};

export default iObserver;
