class SearchService {
    constructor(db) {
        this.db = db;
    }

    async searchProducts(searchTerm) {
        //raw sql search
        const query = `
            SELECT products.*, categories.name AS category_name, brands.name AS brand_name
            FROM products
            LEFT JOIN categories ON categories.id = products.categoryId
            LEFT JOIN brands ON brands.id = products.brandId
            WHERE products.isActive = 1
            AND (
                products.name LIKE :searchTerm
                OR categories.name LIKE :searchTerm
                OR brands.name LIKE :searchTerm
            )
        `;
        return await this.db.sequelize.query(query, {
            replacements: { searchTerm: '%' + searchTerm + '%' },
            type: this.db.sequelize.QueryTypes.SELECT
        });
    }
}

module.exports = SearchService;
