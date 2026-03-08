const generateTxnId = (from, to, amount) => {
    return `${from}_${to}_${amount}`.replace(/\s+/g, '_');
};

class SplitPaymentCalcClass {
    constructor(expenses) {
        this.expenses = expenses;
        this.total = this.calculateTotal();
    }

    getTransactions() {
        const [bins, items] = this.calculateBinsAndItems();

        if (bins.length === 1) {
            const bin = bins[0];

            return items.map((item) => ({
                id: generateTxnId(item.friend.name, bin.friend.name, item.amount.toFixed(2)),
                from_friend: item.friend,
                to_friend: bin.friend,
                amount: item.amount.toFixed(2),
            }));
        }

        const result = [];

        items.forEach((item) => {
            let itemAmount = item.amount;

            for (let i = 0, len = bins.length; i < len; i++) {
                const bin = bins[i];

                if (bin.amount >= itemAmount - 0.01) {
                    bin.amount -= itemAmount;
                    result.push({
                        id: generateTxnId(item.friend.name, bin.friend.name, itemAmount.toFixed(2)),
                        from_friend: item.friend,
                        to_friend: bin.friend,
                        amount: itemAmount.toFixed(2),
                    });

                    return;
                }
            }

            bins.forEach((bin) => {
                if (itemAmount <= 0 || bin.amount <= 0) return;

                let amount;

                if (itemAmount >= bin.amount - 0.01) {
                    itemAmount -= bin.amount;
                    amount = bin.amount;
                } else {
                    bin.amount -= itemAmount;
                    amount = itemAmount;
                }

                result.push({
                    id: generateTxnId(item.friend.name, bin.friend.name, amount.toFixed(2)),
                    from_friend: item.friend,
                    to_friend: bin.friend,
                    amount: amount.toFixed(2),
                });
            });
        });

        return result;
    }

    calculateBinsAndItems() {
        const total = this.calculateTotal();
        const totalPeople = this.calculatePeople();

        const individualShare = total / totalPeople;

        let bins = [];
        let items = [];

        this.expenses.forEach((exp) => {
            if (exp.amount > individualShare) {
                bins.push({
                    friend: exp.friend,
                    amount: exp.amount - individualShare,
                });
            } else if (exp.amount < individualShare) {
                items.push({
                    friend: exp.friend,
                    amount: individualShare - exp.amount,
                });
            }
        });

        return [bins, items];
    }

    calculateTotal() {
        return this.expenses.reduce((a, expense) => a + expense.amount, 0);
    }

    calculatePeople() {
        return this.expenses.length;
    }

    getExpenses() {
        return this.expenses;
    }

    getTotal() {
        return this.total;
    }
}

export default SplitPaymentCalcClass;
