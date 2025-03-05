import React, { Component, PropTypes } from 'react';
import { STRINGTYPES, TYPES, COLORS } from '../Constants';
import { DragSource } from 'react-dnd';
import WhiteKing_img from './images/WhiteKing.png';
import BlackKing_img from './images/BlackKing.png';

const kingSource = {
  beginDrag(props) {
    let colour = props.whiteplayer ? COLORS.WHITE : COLORS.BLACK;
    return {type:TYPES.KING, color: colour, x: props.posX, y:props.posY};
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
  }
}

class King extends Component {
  componentDidMount() {
    const img = new Image();
    img.src = this.props.whiteplayer ? WhiteKing_img : BlackKing_img;
    img.onload = () => this.props.connectDragPreview(img);
  }
  render() {
    const { connectDragSource } = this.props;
    return connectDragSource(
      <div style={{
          fontSize:'65px',
          }}>{this.props.whiteplayer ? '♔' : '♚'}</div>
    );
  }
}

King.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
};

export default DragSource(STRINGTYPES.PIECE, kingSource, collect)(King);