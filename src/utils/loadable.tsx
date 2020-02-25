import React from 'react'
import loadable from '@loadable/component'

const handleLoadable = (componentPath: string) => loadable(() => import('@/' + componentPath))

type GetComponentOptions = {
    loading?: boolean,
    props?: any,
}
const getComponent = (componentPath: string, options: GetComponentOptions = {
  loading: false,
  props: {},
}) => () => {
  const { loading, props } = options
  const Component = handleLoadable(componentPath)
  return <Component {...props} fallback={loading ? <div>loading...</div> : undefined} />
}

export default getComponent
