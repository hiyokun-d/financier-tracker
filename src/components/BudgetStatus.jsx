import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const BudgetStatus = ({ totalSpent, remaining, monthlyBudget }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Budget Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Spent</p>
                            <p className="text-2xl font-bold">  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalSpent)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Remaining</p>
                            <p className="text-2xl font-bold"> {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(remaining)}</p>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                            className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((totalSpent / monthlyBudget) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}