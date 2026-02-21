import { useState } from "react";

// Taskの型定義に「category（カテゴリ）」を追加します
export type Task = {
  title: string;
  done: boolean;
  deadline?: string;
  category: string; // 新規追加
};

export const useHandleTasks = () => {
  // 初期データにそれぞれカテゴリを追加
  const [tasks, setTasks] = useState<Task[]>([
    {
      title: "買い物",
      done: true,
      category: "生活",
    },
    {
      title: "メール返信",
      done: false,
      category: "仕事",
    },
    {
      title: "レポート提出",
      done: false,
      category: "仕事",
    },
  ]);

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const removeTask = (task: Task) => {
    setTasks(tasks.filter((_) => _ !== task));
  };

  const setTaskDone = (task: Task, done: boolean) => {
    setTasks(
      tasks.map((_) =>
        _ !== task
          ? _
          : {
              ...task,
              done,
            }
      )
    );
  };

  return {
    tasks,
    addTask,
    removeTask,
    setTaskDone,
  };
};