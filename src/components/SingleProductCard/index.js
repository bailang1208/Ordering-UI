import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { optimizeImage, formatPrice } from '../../utils'
import { useLanguage, useConfig, useOrder } from 'ordering-components'

import {
  CardContainer,
  CardInfo,
  WrapLogo,
  CardLogo,
  SoldOut
} from './styles'

export const SingleProductCard = (props) => {
  const {
    businessId,
    product,
    isSoldOut,
    isSkeleton,
    onProductClick
  } = props

  const [, t] = useLanguage()
  const [stateConfig] = useConfig()
  const [orderState] = useOrder()

  const editMode = typeof product?.code !== 'undefined'

  const removeToBalance = editMode ? product?.quantity : 0
  const cart = orderState.carts[`businessId:${businessId}`]
  const productCart = cart?.products?.find(prod => prod.id === product?.id)
  const totalBalance = (productCart?.quantity || 0) - removeToBalance

  const maxCartProductConfig = (stateConfig.configs.max_product_amount ? parseInt(stateConfig.configs.max_product_amount) : 100) - totalBalance

  const productBalance = (cart?.products?.reduce((sum, _product) => sum + (product && _product.id === product?.id ? _product.quantity : 0), 0) || 0) - removeToBalance
  let maxCartProductInventory = (product?.inventoried ? product?.quantity : undefined) - productBalance
  maxCartProductInventory = !isNaN(maxCartProductInventory) ? maxCartProductInventory : maxCartProductConfig

  const maxProductQuantity = Math.min(maxCartProductConfig, maxCartProductInventory)

  return (
    <CardContainer soldOut={isSoldOut || maxProductQuantity === 0} onClick={() => onProductClick(product)}>
      <CardInfo soldOut={isSoldOut || maxProductQuantity === 0}>
        {!isSkeleton ? (<h1>{product?.name}</h1>) : (<Skeleton width={100} />)}
        {!isSkeleton ? (<p>{product?.description}</p>) : (<Skeleton width={100} />)}
        {!isSkeleton ? (
          <span>{formatPrice(product?.price)}</span>
        ) : (
          <Skeleton width={100} />
        )}
      </CardInfo>
      {!isSkeleton ? (
        <WrapLogo>
          <CardLogo soldOut={isSoldOut || maxProductQuantity === 0} bgimage={optimizeImage(product?.images, 'h_200,c_limit')} />
        </WrapLogo>
      ) : (
        <Skeleton height={75} width={75} />
      )}
      {(isSoldOut || maxProductQuantity === 0) && <SoldOut>{t('SOLD_OUT', 'SOLD OUT')}</SoldOut>}
    </CardContainer>
  )
}
