import { useState } from 'react'

function useActiveTab(defaultValue = 'areas') {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return {
    activeTab, setActiveTab,
  }
}

export default useActiveTab
