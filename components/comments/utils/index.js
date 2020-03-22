export const formatDate = (date) => {
  const dateObj = new Date(date)

  return dateObj
}

export const formatComments = (comments) => {
  // TODO: do it recursively
  const sortedByDate = comments.sort((a, b) => a.date - b.date)
  const commentArray = sortedByDate.filter((comment) => !comment.parentId)
  const commentsWithSubcomments = commentArray.map((comment) => {
    const { commentId } = comment
    const childs = sortedByDate.filter(({ parentId }) => parentId === commentId)

    return {
      ...comment,
      childs,
    }
  })

  return commentsWithSubcomments
}
