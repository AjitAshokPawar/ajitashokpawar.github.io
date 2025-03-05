import React, { Component, PropTypes } from 'react';
import { STRINGTYPES, TYPES, COLORS } from '../Constants';
import { DragSource } from 'react-dnd';
import WhiteRook_img from './images/WhiteRook.png';
import BlackRook_img from './images/BlackRook.png';

const rookSource = {
  beginDrag(props) {
    let colour = props.whiteplayer ? COLORS.WHITE : COLORS.BLACK;
    return {type:TYPES.ROOK, color: colour, x: props.posX, y:props.posY};
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
  }
}

class Rook extends Component {
  componentDidMount() {
    const img = new Image();
    img.src = this.props.whiteplayer ? WhiteRook_img : BlackRook_img;
    img.onload = () => this.props.connectDragPreview(img);
  }
  render() {
    const { connectDragSource } = this.props;
    return connectDragSource(
      <div style={{
          fontSize:'65px',
          }}>{this.props.whiteplayer ? '♖' : '♜'}</div>
    );
  }
}

Rook.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
};

export default DragSource(STRINGTYPES.PIECE, rookSource, collect)(Rook);