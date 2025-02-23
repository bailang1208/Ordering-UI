import React, { useState } from 'react'
import { ProductsList, useConfig, useLanguage } from 'ordering-components'

import { SingleProductCard } from '../SingleProductCard'
import { NotFoundSource } from '../NotFoundSource'
import { Modal } from '../Modal'
import { shape } from '../../../../../utils'

import {
  ProductsContainer,
  ProductsListing,
  WrapAllCategories,
  ErrorMessage,
  WrapperNotFound,
  HeaderWrapper,
  DescriptionModalContainer,
  RibbonBox
} from './styles'

const BusinessProductsListUI = (props) => {
  const {
    errors,
    businessId,
    category,
    categories,
    categoryState,
    isBusinessLoading,
    onProductClick,
    handleSearchRedirect,
    featured,
    searchValue,
    isCartOnProductsList,
    handleClearSearch,
    errorQuantityProducts,
    currentCart
  } = props

  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const isUseParentCategory = configs?.use_parent_category?.value === 'true' || configs?.use_parent_category?.value === '1'
  const [openDescription, setOpenDescription] = useState(null)

  return (
    <>
      {props.beforeElements?.map((BeforeElement, i) => (
        <React.Fragment key={i}>
          {BeforeElement}
        </React.Fragment>))}
      {props.beforeComponents?.map((BeforeComponent, i) => (
        <BeforeComponent key={i} {...props} />))}
      <ProductsContainer>
        {category?.id && (
          <ProductsListing>
            {
              categoryState.products?.map((product, i) => (
                <SingleProductCard
                  key={i}
                  isSoldOut={(product.inventoried && !product.quantity)}
                  product={product}
                  businessId={businessId}
                  onProductClick={onProductClick}
                  isCartOnProductsList={isCartOnProductsList}
                  productAddedToCartLength={currentCart?.products?.reduce((productsLength, Cproduct) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0)}
                />
              ))
            }
          </ProductsListing>
        )}

        {
          !category?.id && (
            <>
              {
                featured && categoryState?.products?.find(product => product.featured) && (
                  <WrapAllCategories id='categoryfeatured'>
                    <h3>{t('FEATURED', 'Featured')}</h3>
                    <ProductsListing>
                      {categoryState.products?.map((product, i) => product.featured && (
                        <SingleProductCard
                          key={i}
                          isSoldOut={(product.inventoried && !product.quantity)}
                          product={product}
                          businessId={businessId}
                          onProductClick={onProductClick}
                          isCartOnProductsList={isCartOnProductsList}
                          productAddedToCartLength={currentCart?.products?.reduce((productsLength, Cproduct) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0)}
                        />
                      ))}
                    </ProductsListing>
                  </WrapAllCategories>
                )
              }
            </>
          )
        }

        {
          !category?.id && categories.filter(category => category?.id !== null).map((category, i, _categories) => {
            const products = !isUseParentCategory
              ? categoryState?.products?.filter(product => product?.category_id === category?.id) ?? []
              : categoryState?.products?.filter(product => category?.children?.some(cat => cat.category_id === product?.category_id)) ?? []

            const shortCategoryDescription = category?.description?.length > 200 ? `${category?.description?.substring(0, 200)}...` : category?.description

            return (
              <React.Fragment key={i}>
                {
                  products.length > 0 && (
                    <WrapAllCategories id={`category${category?.id}`}>
                      <HeaderWrapper>
                        <div className='category-title'>
                          {
                            category?.image && (
                              <img src={category.image} />
                            )
                          }
                          <h3>{category.name}</h3>
                          {category?.ribbon?.enabled && (
                            <RibbonBox
                              bgColor={category?.ribbon?.color}
                              isRoundRect={category?.ribbon?.shape === shape?.rectangleRound}
                              isCapsule={category?.ribbon?.shape === shape?.capsuleShape}
                            >
                              {category?.ribbon?.text}
                            </RibbonBox>
                          )}
                        </div>
                        {category?.description && (
                          <div className='category-description'>
                            <p>
                              {shortCategoryDescription}
                              {category?.description?.length > 200 && (
                                <span onClick={() => setOpenDescription(category)}>{t('SEE_MORE', 'See more')}</span>
                              )}
                            </p>
                          </div>
                        )}
                      </HeaderWrapper>
                      <ProductsListing>
                        {
                          products.map((product, i) => (
                            <SingleProductCard
                              key={i}
                              isSoldOut={product.inventoried && !product.quantity}
                              businessId={businessId}
                              product={product}
                              onProductClick={onProductClick}
                              isCartOnProductsList={isCartOnProductsList}
                              productAddedToCartLength={currentCart?.products?.reduce((productsLength, Cproduct) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0)}
                            />
                          ))
                        }
                        {
                          categoryState.loading && (i + 1) === _categories.length && [...Array(categoryState.pagination.nextPageItems).keys()].map(i => (
                            <SingleProductCard
                              key={`skeleton:${i}`}
                              isSkeleton
                            />
                          ))
                        }
                      </ProductsListing>
                    </WrapAllCategories>
                  )
                }
              </React.Fragment>
            )
          })
        }

        {
          (categoryState.loading || isBusinessLoading) && (
            <ProductsListing>
              {[...Array(categoryState.pagination.nextPageItems).keys()].map(i => (
                <SingleProductCard
                  key={`skeleton:${i}`}
                  isSkeleton
                />
              ))}
            </ProductsListing>
          )
        }

        {
          !categoryState.loading && !isBusinessLoading && categoryState.products.length === 0 && !((searchValue && errorQuantityProducts) || (!searchValue && !errorQuantityProducts)) && (
            <WrapperNotFound>
              <NotFoundSource
                content={!searchValue ? t('ERROR_NOT_FOUND_PRODUCTS_TIME', 'No products found at this time') : t('ERROR_NOT_FOUND_PRODUCTS', 'No products found, please change filters.')}
                btnTitle={!searchValue ? t('SEARCH_REDIRECT', 'Go to Businesses') : t('CLEAR_FILTERS', 'Clear filters')}
                onClickButton={() => !searchValue ? handleSearchRedirect() : handleClearSearch('')}
              />
            </WrapperNotFound>
          )
        }

        {errors && errors.length > 0 && (
          errors.map((e, i) => (
            <ErrorMessage key={i}>ERROR: [{e}]</ErrorMessage>
          ))
        )}
        <Modal
          open={openDescription}
          title={openDescription?.name}
          onClose={() => setOpenDescription(null)}
        >
          <DescriptionModalContainer>
            {
              openDescription?.image && (
                <img src={openDescription.image} />
              )
            }
            <p>{openDescription?.description}</p>
          </DescriptionModalContainer>
        </Modal>
      </ProductsContainer>
      {props.afterComponents?.map((AfterComponent, i) => (
        <AfterComponent key={i} {...props} />))}
      {props.afterElements?.map((AfterElement, i) => (
        <React.Fragment key={i}>
          {AfterElement}
        </React.Fragment>))}
    </>
  )
}

export const BusinessProductsList = (props) => {
  const businessProductsListProps = {
    ...props,
    UIComponent: BusinessProductsListUI
  }

  return (
    <ProductsList {...businessProductsListProps} />
  )
}
