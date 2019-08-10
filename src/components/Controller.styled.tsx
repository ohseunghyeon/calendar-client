import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  display: flex;
  height: 50px;
  justify-content: space-around;
  align-items: center;
  border-bottom: var(--border) 1px solid;
`;

export const TitleWrapper = styled.div`
  display: flex;
  min-width: 200px;
`;

export const Title = styled.div`
  color: var(--main-text);
`;

export const ArrowWrapper = styled.div`
  margin-right: 20px;
`;

export const MonthWeekButton = styled(Link)`
  color: var(--main-text);
  border: #000 1px solid;
  text-decoration: none;
  padding: 5px;
  &:first-child {
    border-right: none;
  }
  &.selected {
    background-color: var(--primary-bg);
    color: var(--primary-text);
  }
`;
