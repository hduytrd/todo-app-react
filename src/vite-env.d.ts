import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 以下の1行を追加します（<リポジトリ名>はご自身のGitHubリポジトリ名に書き換えてください）
  base: '/<todo-app-react>/', 
})