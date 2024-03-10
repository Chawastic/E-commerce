class BrandService {
    constructor(db) {
        this.db = db;
    }

    async addBrand(brandData) {
        return this.db.Brand.create(brandData);
    }

    async getBrands() {
        return this.db.Brand.findAll();
    }

    async updateBrand(id, updateData) {
        const brand = await this.db.Brand.findByPk(id);
        if (!brand) {
            return null;
        }
        await brand.update(updateData);
        return brand;
    }

    async deleteBrand(id) {
        const brand = await this.db.Brand.findByPk(id);
        if (!brand) {
            throw new Error('Brand not found');
        }
        // just to make sure the brand to be deleted doesnt have products associated
        const products = await brand.getProducts();
        if (products.length > 0) {
            throw new Error('Brand cannot be deleted as it has associated products');
        }
        await brand.destroy();
        return { message: 'Brand deleted successfully' };
    }
};

module.exports = BrandService;
