import React, { useEffect, useState } from 'react'
import { Select } from '../../styles/Select'
import { PlaceSpot as PlaceSpotController, useLanguage } from 'ordering-components'
import { PlaceGroupContainer, PlaceSpotContainer, Title, ButtonWrapper } from './styles'
import Skeleton from 'react-loading-skeleton'
import { NotFoundSource } from '../NotFoundSource'
import { Button } from '../../styles/Buttons'

const PlaceSpotUI = (props) => {
  const {
    cart,
    placesState,
    handleChangePlace,
    onClose
  } = props

  const [, t] = useLanguage()
  const [placeGroupSelected, setPlaceGroupSelected] = useState(null)

  const getPlacesGroups = () => {
    const groups = placesState.placeGroups?.filter(group => group?.enabled && placesState?.places?.find(place => place?.enabled && place?.place_group_id === group?.id))
    return groups.map(group => ({
      value: group,
      content: group?.name,
      showOnSelected: group?.name
    }))
  }

  const getPlaces = () => {
    const places = placeGroupSelected && placesState?.places?.filter(place => place?.enabled && place?.place_group_id === placeGroupSelected?.id)
    return places.map(place => ({
      value: place,
      content: place.name,
      showOnSelected: place.name
    }))
  }

  useEffect(() => {
    if (!placesState?.loading) {
      const placeGroupOnCart = placesState?.placeGroups.find(group => group?.id === cart?.place?.place_group_id)
      setPlaceGroupSelected(placeGroupOnCart)
    }
  }, [placesState])

  return (
    <PlaceSpotContainer>
      {(placesState.error || placesState?.placeGroups?.length === 0) && !placesState?.loading && (
        <NotFoundSource
          content={t('NO_PLACES_THIS_BUSINESS', 'There are not places for this business')}
        />
      )}
      {placesState?.loading && (
        <>
          <PlaceGroupContainer>
            <Skeleton width={100} height={25} className='title' />
            <Skeleton height={30} />
          </PlaceGroupContainer>
          <div>
            <Skeleton width={120} height={25} className='title' />
            <Skeleton height={30} />
          </div>
        </>
      )}
      {!(placesState.error || placesState?.placeGroups?.length === 0) && !placesState?.loading && (
        <>
          <PlaceGroupContainer>
            <Title>{t('PLACE_GROUP', 'Place group')}</Title>
            <Select
              placeholder={t('PLACE_GROUP', 'Place group')}
              options={getPlacesGroups()}
              onChange={(group) => setPlaceGroupSelected(group)}
              defaultValue={placeGroupSelected ?? cart?.place}
              disableOneOption
            />
          </PlaceGroupContainer>
          {placeGroupSelected && (
            <div>
              <Title>{t('SELECT_YOUR_SPOT', 'Select your spot')}</Title>
              <Select
                onChange={(place) => handleChangePlace(place)}
                placeholder={t('SELECT_YOUR_SPOT', 'Select your spot')}
                options={getPlaces()}
                defaultValue={placesState?.places?.find(place => place?.id === cart?.place_id)}
                disableOneOption
              />
            </div>
          )}
        </>
      )}
      {placeGroupSelected && placesState?.places?.find(place => place?.id === cart?.place_id) && (
        <ButtonWrapper>
          <Button
            color={placesState?.loading ? 'secondary' : 'primary'}
            disabled={placesState?.loading}
            onClick={() => onClose && onClose()}
          >
            {t('CONTINUE', 'Continue')}
          </Button>
        </ButtonWrapper>
      )}
    </PlaceSpotContainer>
  )
}

export const PlaceSpot = (props) => {
  const placeSpotProps = {
    ...props,
    UIComponent: PlaceSpotUI
  }

  return <PlaceSpotController {...placeSpotProps} />
}
