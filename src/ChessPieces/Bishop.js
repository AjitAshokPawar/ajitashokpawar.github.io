import React, { Component, PropTypes } from 'react';
import { STRINGTYPES, TYPES, COLORS } from '../Constants';
import { DragSource } from 'react-dnd';
import WhiteBishop_img from './images/WhiteBishop.png';
import BlackBishop_img from './images/BlackBishop.png';

const bishopSource = {
  beginDrag(props) {
    let colour = props.whiteplayer ? COLORS.WHITE : COLORS.BLACK;
    return {type:TYPES.BISHOP, color: colour, x: props.posX, y:props.posY};
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
  }
}

class Bishop extends Component {
  componentDidMount() {
    const img = new Image();
    img.src = this.props.whiteplayer ? WhiteBishop_img : BlackBishop_img;
    img.onload = () => this.props.connectDragPreview(img);
  }
  render() {
    const { connectDragSource } = this.props;
    return connectDragSource(
      <div style={{
          fontSize:'65px',
          }}>{this.props.whiteplayer ? '♗' : '♝'}</div>,
    );
  }
}

Bishop.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
};

export default DragSource(STRINGTYPES.PIECE, bishopSource, collect)(Bishop);