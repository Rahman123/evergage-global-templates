(function() {

    /**
     * @function buildMsgSelectorFromContext
     * @param {Object} context
     * @description Creates CSS selector for template's message by using values from context
     */
    function buildMsgSelectorFromContext(context) {
        return `[data-evg-campaign-id=${context.campaign}][data-evg-experience-id=${context.experience}]`;
    }

    /**
     * @function setInfobarPosition
     * @param {Object} context
     * @description Sets the position of the infobar via class assignments, based on content zone selected.
     */
    function setInfobarPosition(context) {
        context.infobarClass = context.contentZone == "global_infobar_top_of_page"
            ? "evg-infobar-top"
            : "evg-infobar-bottom";
        if (context.infobarClass === "evg-infobar-top") {
            Evergage.cashDom("body").css({ "margin-bottom": "0", "margin-top": "2.5rem" });
        } else {
            Evergage.cashDom("body").css({ "margin-bottom": "2.5rem", "margin-top": "0" });
        }
    }

    /**
     * @function setDismissal
     * @param {Object} context
     * @description Adds click listener to the "X" button that removes the template from the DOM.
     */
    function setDismissal(context) {
        Evergage.cashDom("#evg-infobar-with-cta .evg-btn-dismissal").on("click", () => {
            Evergage.cashDom(buildMsgSelectorFromContext(context))
                .remove();
            Evergage.cashDom("body").css({ "margin-top": "0", "margin-bottom": "0" });
        });
    }

    function apply(context, template) {
        setInfobarPosition(context);
        const html = template(context);
        Evergage.cashDom("body").append(html);
        setDismissal(context);
    }

    function reset(context, template) {
        Evergage.cashDom(buildMsgSelectorFromContext(context))
            .remove();
        Evergage.cashDom("body").css({ "margin-top": "0", "margin-bottom": "0" });
    }

    function control() {

    }

    registerTemplate({
        apply: apply,
        reset: reset,
        control: control
    });

  })();
