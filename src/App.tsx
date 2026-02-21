import React, { useState } from "react";
import { useHandleTasks } from "./useHandleTasks";
import "./App.css";

const CATEGORIES = ["生活", "仕事", "その他"];

const App: React.FC = () => {
  const { tasks, addTask, removeTask, setTaskDone } = useHandleTasks();
  
  const [title, setTitle] = useState("");
  const [hasDeadline, setHasDeadline] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [filterCategory, setFilterCategory] = useState("すべて表示");

  // タスクの絞り込み処理
  const filteredTasks = tasks.filter((task) => {
    if (filterCategory === "すべて表示") return true;
    return task.category === filterCategory;
  });

  // 絞り込まれたタスクを期限順に並び替え
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  // 期限切れ判定関数
  const isOverdue = (taskDeadline?: string) => {
    if (!taskDeadline) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(taskDeadline);
    deadlineDate.setHours(0, 0, 0, 0);
    return deadlineDate.getTime() < today.getTime();
  };

  return (
    // 【修正点】アプリ全体を囲むdivを追加し、幅を固定して中央に配置。中の要素は左揃えに統一。
    <div style={{ maxWidth: "350px", margin: "40px auto", textAlign: "left", fontFamily: "sans-serif" }}>
      
      {/* --- タスク追加フォームエリア --- */}
      <div className="form" style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        
        {/* 1段目: 期限を設定 */}
        <div>
          <label>
            期限を設定: 
            <input
              type="checkbox"
              checked={hasDeadline}
              onChange={(e) => {
                setHasDeadline(e.target.checked);
                if (!e.target.checked) setDeadline("");
              }}
              style={{ marginLeft: "5px" }}
            />
          </label>
          {hasDeadline && (
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              style={{ marginLeft: "10px" }}
            />
          )}
        </div>

        {/* 2段目: カテゴリを設定 */}
        <div>
          <label>
            カテゴリ:
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              style={{ marginLeft: "5px", padding: "2px 4px" }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
        </div>

        {/* 3段目: テキスト入力と追加ボタン */}
        <div style={{ display: "flex", gap: "5px" }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ flexGrow: 1, padding: "4px" }} // 入力欄を可能な限り伸ばす
          />
          <input
            type="button"
            value="追加"
            style={{ padding: "4px 16px", cursor: "pointer" }}
            onClick={() => {
              if (!title.trim()) return;
              addTask({ 
                title, 
                done: false, 
                deadline: hasDeadline && deadline ? deadline : undefined,
                category: category 
              });
              setTitle("");
              setHasDeadline(false);
              setDeadline("");
              setCategory(CATEGORIES[0]);
            }}
          />
        </div>
      </div>
      
      {/* --- カテゴリ絞り込みエリア --- */}
      {/* 【修正点】上のフォームと同じ幅・左揃えのラインに乗るように調整 */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          カテゴリで絞り込む:
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ marginLeft: "5px", padding: "2px 4px" }}
          >
            <option value="すべて表示">すべて表示</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
      </div>

      {/* --- タスクリスト表示エリア --- */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {sortedTasks.map((task, i) => {
          const overdue = isOverdue(task.deadline) && !task.done;
          const bgColor = task.done ? "#ffffcc" : overdue ? "#ffebee" : "#ffffff";

          return (
            <li 
              key={i}
              style={{
                backgroundColor: bgColor,
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}
            >
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={(e) => setTaskDone(task, e.target.checked)}
                  style={{ marginRight: "10px" }}
                />
                <span style={{ color: "#aaa", marginRight: "8px", fontSize: "0.9em" }}>
                  {task.category}
                </span>
                <span style={{ color: overdue ? "red" : "inherit" }}>
                  {task.title}
                </span>
                {task.deadline && (
                  <span style={{ marginLeft: "10px", fontSize: "0.85em", color: overdue ? "red" : "#666" }}>
                    (期限: {task.deadline})
                  </span>
                )}
              </label>
              
              <button 
                onClick={() => removeTask(task)}
                style={{
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  border: "none",
                  backgroundColor: "#e0e0e0",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold"
                }}
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default App;