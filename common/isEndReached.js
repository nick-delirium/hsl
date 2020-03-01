const isEndReached = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
}

export default isEndReached
