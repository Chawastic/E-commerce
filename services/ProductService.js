class ProductService {
    constructor(db) {
        this.db = db;
    }

    async addProduct(productData) {
        return this.db.Product.create(productData);
    }

    async getAllProducts() {
        return this.db.Product.findAll();
    }

    async updateProduct(productId, updateData) {
        const product = await this.db.Product.findByPk(productId);
        if (!product) {
            return null;
        }
        return await product.update(updateData);
    }

    async softDeleteProduct(productId) {
        const [updated] = await this.db.Product.update({ isActive: false }, { where: { id: productId } });
        return updated;
    }
}

module.exports = ProductService;

