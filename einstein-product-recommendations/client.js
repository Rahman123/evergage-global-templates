(function() {

    /**
     * @function buildBindId
     * @param {Object} context
     * @description Create unique bind ID based on the campaign and experience IDs.
     */
    function buildBindId(context) {
        return `${context.campaign}:${context.experience}`;
    }

    function apply(context, template) {
        const contentZoneSelector = Salesforce.getContentZoneSelector(context.contentZone);

        /**
         * The pageElementLoaded method waits for the content zone to load into the DOM
         * before rendering the template. The observer element that monitors for the content
         * zone element to get inserted into its DOM node is set to "body" by default.
         * For performance optimization, this default can be overridden by adding
         * a second selector argument, which will be used as the observer element instead.
         *
         * Visit the Template Display Utilities documentation to learn more:
         * https://developer.evergage.com/campaign-development/web-templates/web-display-utilities
         */
        return Salesforce.DisplayUtils
            .bind(buildBindId(context))
            .pageElementLoaded(contentZoneSelector)
            .then((element) => {
                const html = template(context);
                Salesforce.cashDom(element).html(html);
            });
    }

    function reset(context, template) {
        Salesforce.DisplayUtils.unbind(buildBindId(context));
        Salesforce.cashDom(`[data-evg-campaign-id="${context.campaign}"][data-evg-experience-id="${context.experience}"]`)
            .remove();
    }

    function control(context) {
        const contentZoneSelector = Salesforce.getContentZoneSelector(context.contentZone);
        return Salesforce.DisplayUtils
            .bind(buildBindId(context))
            .pageElementLoaded(contentZoneSelector)
            .then((element) => {
                Salesforce.cashDom(element).attr({
                    "data-evg-campaign-id": context.campaign,
                    "data-evg-experience-id": context.experience,
                    "data-evg-user-group": context.userGroup
                });
            });
    }

    registerTemplate({
        apply: apply,
        reset: reset,
        control: control
    });

})();
