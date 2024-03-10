class MembershipService {
    constructor(db) {
        this.db = db;
    }

    async getAllMemberships() {
        return await this.db.Membership.findAll();
    }

    async addMembership(membershipData) {
        return this.db.Membership.create(membershipData);
    }

    async updateMembership(id, updateData) {
        const membership = await this.db.Membership.findByPk(id);
        if (!membership) {
            throw new Error('Membership not found');
        }
        await membership.update(updateData);
        return membership;
    }

    async deleteMembership(id) {
        const users = await this.db.User.findAll({
            where: { membership_id: id }
        });
        if (users.length > 0) {
            throw new Error('Membership cannot be deleted as it is currently assigned to users.');
        }
        const membership = await this.db.Membership.findByPk(id);
        if (!membership) {
            throw new Error('Membership not found');
        }
        await membership.destroy();
        return { message: 'Membership deleted successfully' };
    }
}

module.exports = MembershipService;
