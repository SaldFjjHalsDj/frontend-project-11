export default (string) => {
    const parser = new DOMParser();
    const xmlString = parser.parseFromString(string, 'application/xml');

    const errorNode = xmlString.querySelector('parsererror');

    if (errorNode) {
        const error = new Error(errorNode.textContent);
        error.isParseError = true;
        throw error;
    }

    const title = xmlString.querySelector('title');
    const description = xmlString.querySelector('description');

    const itemsElements = xmlString.querySelectorAll('item');

    const items = [...itemsElements].map((item) => {
        const itemTitle = item.querySelector('title');
        const itemDescription = item.querySelector('description');
        const itemLink = item.querySelector('link');

        return {
            title: itemTitle.textContent,
            description: itemDescription.textContent,
            link: itemLink.textContent,
        };
    });

    return {
        title: title.textContent,
        description: description.textContent,
        items,
    };
};
