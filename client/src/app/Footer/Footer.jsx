import React from "react";

const Footer = () => {
    return (
        <footer
            className="border-top pt-5 mt-5 container text-center"
            style={{ color: "grey" }}
        >
            <address className="">
                <div>This site made by Kirill dev. Want the same?</div>
                <p>
                    Any questions feel free to{" "}
                    <a href="mailto:podpalmoi@gmail.com">contact</a>.
                </p>
            </address>
        </footer>
    );
};

export default Footer;
