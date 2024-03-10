class CartService {
    constructor(db) {
        this.db = db;
    }

    async addToCart(userId, productId, quantityToAdd) {
        try {
            //find the product by its id
            const product = await this.db.Product.findByPk(productId);
            if (!product) {
                throw new Error('Product does not exist');
            }
            //check if there's enough stock for the requested quantity
            if (product.stockQuantity < quantityToAdd) {
                throw new Error('Not enough stock for the requested quantity');
            } 

            const [order] = await this.db.Order.findOrCreate({
                where: { UserId: userId, 
                    status: 'In Cart' },
                defaults: { status: 'In Cart' }
            });
            //find an existing order item for the product in the user's cart
            let orderItem = await this.db.OrderItem.findOne({
                where: { OrderId: order.id, 
                    ProductId: productId }
            });
            if (orderItem) {
                if (orderItem.quantity + quantityToAdd > product.stockQuantity) {
                    throw new Error('Not enough stock to add to the cart');
                }
                orderItem.quantity += quantityToAdd;
                await orderItem.save();
            } else {
                //if order doesnt exist - created one
                orderItem = await this.db.OrderItem.create({
                    OrderId: order.id,
                    ProductId: productId,
                    quantity: quantityToAdd,
                    unitPrice: product.price
                });
            }
            await order.update({ updatedAt: new Date() });
            return {
                status: "success",
                statuscode: 200,
                data: orderItem
            };
        } catch (error) {
            throw error;
        }
    }

    async getUserCart(userId) {
        try {
            const userCartItems = await this.db.Order.findAll({
                where: { 
                    UserId: userId,
                    status: 'In Cart'
                }
            });
            return {
                status: "success",
                statuscode: 200,
                data: userCartItems
            };
        } catch (error) {
            throw error;
        }
    }

    async updateCartItemQuantity(orderItemId, newQuantity) {
        try {
            //finds order by primary key
            const orderItem = await this.db.OrderItem.findByPk(orderItemId);
            //error if order cant be found
            if (!orderItem) {
                throw new Error('Order item not found.');
            }

            const product = await this.db.Product.findByPk(orderItem.ProductId);
            if (!product) {
                throw new Error('Associated product not found.');
            }
            //not enough in stock
            if (newQuantity > product.stockQuantity) {
                throw new Error(`Requested quantity exceeds available stock. Available stock: ${product.stockQuantity}.`);
            }
            orderItem.quantity = newQuantity;
            await orderItem.save();
    
            return {
                status: "success",
                statuscode: 200,
                data: orderItem
            };
        } catch (error) {
            console.error('Error updating cart item quantity:', error);
            throw error;
        }
    }

    async removeProductFromCart(userId, productId) {
        try {
            //finds order by user id with in cart status
            const order = await this.db.Order.findOne({
                where: { UserId: userId, 
                    status: 'In Cart' }
            });
            if (!order) {
                throw new Error('Active cart not found.');
            }
             //find the order item in the cart based on product id
            const orderItem = await this.db.OrderItem.findOne({
                where: { OrderId: order.id, 
                    ProductId: productId }
            });
            if (!orderItem) {
                throw new Error('Product not found in cart.');
            }
            await orderItem.destroy();
            return { message: 'Product removed from cart.' };
        } catch (error) {
            console.error('Error removing product from cart:', error);
            throw error;
        }
    }

    async checkout(userId) {
        try {
            //find the user's cart with 'In Cart' status and include order items
            const cart = await this.db.Order.findOne({
                where: { UserId: userId, status: 'In Cart' },
                include: [{
                    model: this.db.OrderItem,
                    as: 'orderItems'
                }]
            });
            //error if no active cart found
            if (!cart) {
                throw new Error('No active cart found for the user.');
            }
            //calculate the total quantity of items in the cart
            const totalItemsOrdered = cart.orderItems.reduce((total, item) => total + item.quantity, 0);
            //update the cart status to 'Ordered'
            await cart.update({ status: 'Ordered' });
            //find the user and update their purchases with the total items ordered
            const user = await this.db.User.findByPk(userId);
            const updatedPurchases = user.purchases + totalItemsOrdered;
            await user.update({ purchases: updatedPurchases });
            //determine the membership_id based on the updated purchases
            let membershipIdToUpdate = user.membership_id;
            if (updatedPurchases >= 30) { 
                membershipIdToUpdate = 3;
            } else if (updatedPurchases >= 15) {
                membershipIdToUpdate = 2;
            }
            //update the user's membership
            if (membershipIdToUpdate !== user.membership_id) {
                await user.update({ membership_id: membershipIdToUpdate });
            }
            return {
                message: 'Checkout successful',
                orderId: cart.id,
                status: 'Ordered',
                totalItemsOrdered,
                updatedPurchasesCount: updatedPurchases,
                membershipUpdated: user.membership_id === membershipIdToUpdate
            };
        } catch (error) {
            console.error('Error during checkout:', error);
            throw error;
        }
    }

    async applyDiscountToOrder(userId, orderId) {
        const transaction = await this.db.sequelize.transaction();
        try {
            //retrieve user with membership to get the discount rate
            const userWithMembership = await this.db.User.findByPk(userId, {
                include: ['Membership'],
                transaction
            });
            //proceed only if the user exists and has a membership
            if (userWithMembership && userWithMembership.Membership) {
                const discountRate = userWithMembership.Membership.discount_rate;
                //retrieve the order items that have not had the discount applied
                const orderItems = await this.db.OrderItem.findAll({
                    where: { 
                        OrderId: orderId, 
                        discountApplied: false
                    },
                    include: [{
                        model: this.db.Order,
                        where: { UserId: userId }
                    }],
                    transaction
                });
                for (const item of orderItems) {
                    const discountedPrice = item.unitPrice * (1 - discountRate / 100);
                    await item.update({
                        unitPrice: discountedPrice,
                        discountApplied: true //so users cant multiply their discount
                    }, { transaction });
                }
                await transaction.commit();
                return orderItems;
            } else {
                throw new Error('User membership information not available.');
            }
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = CartService;
