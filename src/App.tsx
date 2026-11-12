import './App.css'; 
import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  PieChart as PieChartIcon, 
  BarChart2, 
  PlusCircle, 
  Trash2, 
  Calendar,
  Tag,
  DollarSign
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

interface Transaction {
  id: string;
  type: 'expense' | 'income';
  category: string;
  amount: number;
  date: string;
  memo: string;
}

const EXPENSE_CATEGORIES = [
  '食費',
  '住居費',
  '光熱費',
  '通信費',
  '交通費',
  '日用品',
  '娯楽・趣味',
  '医療・健康',
  '衣服・美容',
  'その他'
];

const INCOME_CATEGORIES = [
  '給与',
  '賞与',
  '副業',
  '投資',
  'その他'
];

const COLORS = [
  '#0284c7', '#38bdf8', '#7dd3fc', '#bae6fd', '#38bdf8',
  '#0369a1', '#0ea5e9', '#60a5fa', '#93c5fd', '#bfdbfe'
];

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'input' | 'history' | 'analysis'>('dashboard');
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'expense', category: '食費', amount: 35000, date: '2026-10-15', memo: 'スーパー' },
    { id: '2', type: 'expense', category: '家賃', amount: 80000, date: '2026-10-01', memo: '家賃' },
    { id: '3', type: 'expense', category: '光熱費', amount: 12000, date: '2026-10-10', memo: '電気・ガス代' },
    { id: '4', type: 'income', category: '給与', amount: 280000, date: '2026-10-25', memo: '10月分給与' },
    { id: '5', type: 'expense', category: '通信費', amount: 6500, date: '2026-10-05', memo: 'スマホ料金' },
    { id: '6', type: 'expense', category: '娯楽・趣味', amount: 15000, date: '2026-10-18', memo: '映画と書籍' },
  ]);

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [memo, setMemo] = useState('');

  const handleTypeChange = (newType: 'expense' | 'income') => {
    setType(newType);
    setCategory(newType === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    const newTx: Transaction = {
      id: Date.now().toString(),
      type,
      category,
      amount: Number(amount),
      date,
      memo: memo.trim() || (type === 'expense' ? category : '収入')
    };

    setTransactions([newTx, ...transactions]);
    setAmount('');
    setMemo('');
    setActiveTab('dashboard');
  };

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const expenseByCategory = EXPENSE_CATEGORIES.map(cat => {
    const total = transactions
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: cat, value: total };
  }).filter(item => item.value > 0);

  const monthlyComparison = [
    { month: '7月', 収入: 270000, 支出: 185000 },
    { month: '8月', 収入: 280000, 支出: 198000 },
    { month: '9月', 収入: 275000, 支出: 172000 },
    { month: '今月', 収入: totalIncome, 支出: totalExpense },
  ];

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>
          <Wallet className="header-icon" />
          シンプル家計簿
        </h1>
        <p>シンプルでわかりやすいスマート家計簿</p>
      </header>

      <main className="app-main">
        {activeTab === 'dashboard' && (
          <div className="dashboard-view">
            <div className="summary-card">
              <div className="balance-box">
                <span className="label">今月の残高</span>
                <span className={`amount ${balance >= 0 ? 'positive' : 'negative'}`}>
                  ¥{balance.toLocaleString()}
                </span>
              </div>
              <div className="summary-row">
                <div className="summary-item income">
                  <ArrowUpCircle size={20} />
                  <div>
                    <span className="sub-label">収入</span>
                    <p>¥{totalIncome.toLocaleString()}</p>
                  </div>
                </div>
                <div className="summary-item expense">
                  <ArrowDownCircle size={20} />
                  <div>
                    <span className="sub-label">支出</span>
                    <p>¥{totalExpense.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2>今月の支出割合</h2>
              {expenseByCategory.length > 0 ? (
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100% " height={220}>
                    <PieChart>
                      <Pie
                        data={expenseByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {expenseByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`¥${value.toLocaleString()}`, '金額']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="empty-text">支出データがまだありません</p>
              )}
            </div>

            <div className="card">
              <h2>最近の入出金履歴</h2>
              <div className="transaction-list">
                {transactions.slice(0, 5).map(t => (
                  <div key={t.id} className="transaction-item">
                    <div className="tx-info">
                      <span className={`badge ${t.type}`}>
                        {t.type === 'income' ? '収入' : '支出'}
                      </span>
                      <div>
                        <p className="tx-category">{t.category}</p>
                        <p className="tx-memo">{t.memo} ({t.date})</p>
                      </div>
                    </div>
                    <span className={`tx-amount ${t.type}`}>
                      {t.type === 'income' ? '+' : '-'}¥{t.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'input' && (
          <div className="card">
            <h2>収支の入力</h2>
            <form onSubmit={handleSubmit} className="entry-form">
              <div className="type-toggle">
                <button
                  type="button"
                  className={type === 'expense' ? 'active expense' : ''}
                  onClick={() => handleTypeChange('expense')}
                >
                  支出
                </button>
                <button
                  type="button"
                  className={type === 'income' ? 'active income' : ''}
                  onClick={() => handleTypeChange('income')}
                >
                  収入
                </button>
              </div>

              <div className="form-group">
                <label>カテゴリー</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  {(type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>金額 (円)</label>
                <input
                  type="number"
                  placeholder="例: 3000"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>日付</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>メモ (任意)</label>
                <input
                  type="text"
                  placeholder="例: スーパーでの買い物"
                  value={memo}
                  onChange={e => setMemo(e.target.value)}
                />
              </div>

              <button type="submit" className="submit-btn">登録する</button>
            </form>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="card">
            <h2>すべての履歴</h2>
            <div className="transaction-list full">
              {transactions.length === 0 ? (
                <p className="empty-text">履歴がありません</p>
              ) : (
                transactions.map(t => (
                  <div key={t.id} className="transaction-item">
                    <div className="tx-info">
                      <span className={`badge ${t.type}`}>
                        {t.type === 'income' ? '収入' : '支出'}
                      </span>
                      <div>
                        <p className="tx-category">{t.category}</p>
                        <p className="tx-memo">{t.memo} ({t.date})</p>
                      </div>
                    </div>
                    <div className="tx-right">
                      <span className={`tx-amount ${t.type}`}>
                        {t.type === 'income' ? '+' : '-'}¥{t.amount.toLocaleString()}
                      </span>
                      <button onClick={() => handleDelete(t.id)} className="delete-btn" aria-label="削除">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="dashboard-view">
            <div className="card">
              <h2>過去の収支比較 (直近4ヶ月)</h2>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyComparison}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`¥${value.toLocaleString()}`, '']} />
                    <Legend />
                    <Bar dataKey="収入" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="支出" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h2>カテゴリー別支出内訳</h2>
              <div className="category-breakdown-list">
                {EXPENSE_CATEGORIES.map(cat => {
                  const total = transactions
                    .filter(t => t.type === 'expense' && t.category === cat)
                    .reduce((sum, t) => sum + t.amount, 0);
                  const percentage = totalExpense > 0 ? Math.round((total / totalExpense) * 100) : 0;
                  
                  return (
                    <div key={cat} className="breakdown-item">
                      <div className="breakdown-info">
                        <span className="breakdown-cat">{cat}</span>
                        <span className="breakdown-amount">¥{total.toLocaleString()} ({percentage}%)</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div 
                          className="progress-bar-fill" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          <Wallet size={20} />
          <span>ホーム</span>
        </button>
        <button 
          className={activeTab === 'input' ? 'active' : ''} 
          onClick={() => setActiveTab('input')}
        >
          <PlusCircle size={20} />
          <span>入力</span>
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''} 
          onClick={() => setActiveTab('history')}
        >
          <Calendar size={20} />
          <span>履歴</span>
        </button><button 
          className={activeTab === 'analysis' ? 'active' : ''} 
          onClick={() => setActiveTab('analysis')}
        >
          <BarChart2 size={20} />
          <span>比較・分析</span>
        </button>
      </nav>
    </div>
  );
}
export default App;
