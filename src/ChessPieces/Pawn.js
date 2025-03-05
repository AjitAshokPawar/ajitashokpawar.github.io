import React, { Component, PropTypes } from 'react';
import { STRINGTYPES, TYPES, COLORS } from '../Constants';
import { DragSource } from 'react-dnd';
import WhitePawn_img from './images/WhitePawn.png';
import BlackPawn_img from './images/BlackPawn.png';

const pawnSource = {
  beginDrag(props) {
    let colour = props.whiteplayer ? COLORS.WHITE : COLORS.BLACK;
    return {type:TYPES.PAWN, color: colour, x: props.posX, y:props.posY};
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
  }
}

class Pawn extends Component {
  componentDidMount() {
    const img = new Image();
    img.src = this.props.whiteplayer ? WhitePawn_img : BlackPawn_img;
    img.onload = () => this.props.connectDragPreview(img);
  }
  render() {
    const { connectDragSource } = this.props;
    return connectDragSource(
      <div style={{
          fontSize:'65px',
          }}>{this.props.whiteplayer ? '♙' : '♟'}</div>
    );
  }
}

Pawn.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
};

export default DragSource(STRINGTYPES.PIECE, pawnSource, collect)(Pawn);