export const formatDate = (date) => {
  const dateObj = new Date(date)

  return dateObj
}

export const formatComments = (comments) => {
  const commentArray = comments.filter((comment) => !comment.parentId)
  const commentsWithSubcomments = commentArray.map((comment) => {
    const { commentId } = comment
    const childs = comments.filter(({ parentId }) => parentId === commentId)

    return {
      ...comment,
      childs,
    }
  })

  return commentsWithSubcomments
}
