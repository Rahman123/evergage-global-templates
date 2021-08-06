(function() {

    const pageExitMillis = 500;

    /**
     * @function buildBindId
     * @param {Object} context
     * @description Create unique bind ID based on the campaign and experience IDs.
     */
    function buildBindId(context) {
        return `${context.campaign}:${context.experience}`;
    }

    /**
     * @function setConfirmationPanel
     * @description Add click listener to the Call-To-Action button that validates the user email address,
     * shows the Confirmation Panel, removes dismissal tracking from the "X" button and overlay, and sends
     * an event to Interaction Studio to set the emailAddress attribute to the user email address.
     */
    function setConfirmationPanel() {
        Salesforce.cashDom("#evg-exit-intent-popup-email-capture .evg-cta").on("click", () => {
            const emailAddress = Salesforce.cashDom(".evg-form input[placeholder='Email']").val();
            const regex = RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]+)$/);
            if (emailAddress && regex.test(emailAddress)) {
                Salesforce.cashDom("#evg-exit-intent-popup-email-capture .evg-main-panel").addClass("evg-hide");
                Salesforce.cashDom("#evg-exit-intent-popup-email-capture .evg-confirm-panel").removeClass("evg-hide");
                Salesforce.cashDom(`
                    #evg-exit-intent-popup-email-capture .evg-overlay,
                    #evg-exit-intent-popup-email-capture .evg-btn-dismissal
                `).removeAttr("data-evg-dismissal");
                Salesforce.sendEvent({
                    user: {
                        attributes: {
                            emailAddress: emailAddress
                        }
                    }
                });
            } else {
                Salesforce.cashDom("#evg-exit-intent-popup-email-capture .evg-error-msg")
                    .removeClass("evg-hide")
                    .addClass("evg-error");
            }
        });
    }

    /**
     * @function setDismissal
     * @param {Object} context
     * @description Add click listener to the overlay, "X" button, and opt-out text that removes the
     * template from the DOM.
     */
    function setDismissal(context) {
        const dismissSelectors = `
            #evg-exit-intent-popup-email-capture .evg-overlay,
            #evg-exit-intent-popup-email-capture .evg-btn-dismissal,
            #evg-exit-intent-popup-email-capture .evg-opt-out-msg
        `;

        Salesforce.cashDom(dismissSelectors).on("click", () => {
            Salesforce.cashDom("#evg-exit-intent-popup-email-capture").remove();
        });
    }

    function apply(context, template) {
        if (!context.contentZone) return;

        /**
         * The pageExit method waits for the user's cursor to exit through the top edge of the page before rendering the
         * template after a set delay.
         *
         * Visit the Template Display Utilities documentation to learn more:
         * https://developer.evergage.com/campaign-development/web-templates/web-display-utilities
         */
        return Salesforce.DisplayUtils
            .bind(buildBindId(context))
            .pageExit(pageExitMillis)
            .then(() => {
                if (Salesforce.cashDom("#evg-exit-intent-popup").length > 0) return;

                const html = template(context);
                Salesforce.cashDom("body").append(html);
                setConfirmationPanel();
                setDismissal(context);
            });
    }

    function reset(context, template) {
        Salesforce.DisplayUtils.unbind(buildBindId(context));
        Salesforce.cashDom("#evg-exit-intent-popup-email-capture").remove();
    }

    function control(context) {
        return Salesforce.DisplayUtils
            .bind(buildBindId(context))
            .pageExit(pageExitMillis)
            .then(() => {
                if (context.contentZone) return true;
            });
    }

    registerTemplate({
        apply: apply,
        reset: reset,
        control: control
    });

})();
