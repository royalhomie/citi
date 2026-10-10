import { Plane, Shield, Car, Target, Home, GraduationCap, Plus, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { bankingActions } from '@/hooks/useBankingData';
import type { Goal } from '@/types';

interface SavingsGoalsProps {
  goals: Goal[];
  onRefresh: () => void;
}

const goalIcons: Record<string, typeof Plane> = {
  plane: Plane,
  shield: Shield,
  car: Car,
  target: Target,
  home: Home,
  graduation: GraduationCap,
};

const colorMap: Record<string, { bar: string; bg: string; text: string }> = {
  citi: { bar: 'bg-citi-500', bg: 'bg-citi-50', text: 'text-citi-600' },
  emerald: { bar: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  amber: { bar: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-600' },
};

export default function SavingsGoals({ goals, onRefresh }: SavingsGoalsProps) {
  const handleContribute = (goal: Goal) => {
    const amount = window.prompt(`How much would you like to add to "${goal.name}"?`, '100');
    if (!amount) return;
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) return;

    try {
      bankingActions.contributeToGoal(goal.id, parsed);
      onRefresh();
    } catch (err) {
      console.error('Failed to add to goal:', err);
    }
  };

  const handleNewGoal = () => {
    const name = window.prompt('What are you saving for?', 'Home Renovation');
    if (!name || !name.trim()) return;
    const target = window.prompt(`Target amount for "${name.trim()}"?`, '5000');
    if (!target) return;
    const parsedTarget = parseFloat(target);
    if (!parsedTarget || parsedTarget <= 0) return;

    try {
      bankingActions.addGoal({ name, targetAmount: parsedTarget });
      onRefresh();
    } catch (err) {
      console.error('Failed to create goal:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 card-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900">Savings Goals</h3>
        <button
          onClick={handleNewGoal}
          className="text-xs text-citi-600 font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> New Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-6">No goals yet. Start saving today!</p>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const Icon = goalIcons[goal.icon] || Target;
            const colors = colorMap[goal.color] || colorMap.citi;
            const percent = Math.min(Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100), 100);
            const remaining = Number(goal.target_amount) - Number(goal.current_amount);

            return (
              <div key={goal.id} className="group">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg} ${colors.text}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{goal.name}</p>
                    <p className="text-xs text-slate-400">
                      {formatCurrency(Number(goal.current_amount))} of {formatCurrency(Number(goal.target_amount))}
                    </p>
                  </div>
                  <span className={`text-sm font-bold ${colors.text}`}>{percent}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full ${colors.bar} rounded-full transition-all duration-500`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {remaining > 0 ? `${formatCurrency(remaining)} to go` : 'Goal reached!'}
                  </span>
                  {goal.deadline && (
                    <span className="text-slate-400">
                      Due {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                </div>
                {remaining > 0 && (
                  <button
                    onClick={() => handleContribute(goal)}
                    className={`mt-2 w-full py-2 rounded-lg text-xs font-medium transition-all ${colors.bg} ${colors.text} hover:brightness-95 flex items-center justify-center gap-1.5`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" /> Add Money
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
