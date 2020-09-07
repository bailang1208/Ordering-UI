import styled from 'styled-components'

export const LoginContainer = styled.div`
  background-color: #F8F8F8;
  display: flex;
`

export const Triangle = styled.div`
  width: 20%;
  max-width: 200px;
  position: relative;
  /* width: 0;
  height: 0;
  border-top: 50% solid transparent;
  border-bottom: 50vh solid transparent;
  border-right:25vh solid blue; */

  &::after {
    position: absolute;
    content: '';
  }
`

export const FormSide = styled.div`
`

export const HeroSide = styled.div`

`
