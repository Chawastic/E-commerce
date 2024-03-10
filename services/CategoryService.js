class CategoryService {
    constructor(db) {
        this.db = db;
    }

    async addCategory(categoryData) {
        return this.db.Category.create(categoryData);
    }

    async getCategories() {
        return this.db.Category.findAll();
    }

    async updateCategory(id, updateData) {
        const category = await this.db.Category.findByPk(id);
        if (!category) {
            return null;
        }
        await category.update(updateData);
        return category;
    }

    async deleteCategory(id) {
        const category = await this.db.Category.findByPk(id);
        if (!category) {
            throw new Error('Category not found');
        }
        const products = await category.getProducts();
        if (products && products.length > 0) {
            throw new Error('Category cannot be deleted as it has associated products');
        }
        await category.destroy();
        return { message: 'Category deleted successfully' };
    }
}

module.exports = CategoryService;
