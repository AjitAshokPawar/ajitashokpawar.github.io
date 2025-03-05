var React = require('react');
import styles from './ChessPieces.css'

var Knight = function (props) {
        return <div style={{
          fontSize:'65px',
          }}>{props.white ? '♘' : '♞'}</div>;       
      };

var King = function (props) {
        return <div style={{
          fontSize:'65px',
          }}>{props.white ? '♔' : '♚'}</div>;       
      };

var Queen = function (props) {
        return <div style={{
          fontSize:'65px',
          }}>{props.white ? '♕' : '♛'}</div>;       
      };

var Rook = function (props) {
        return <div style={{
          fontSize:'65px',
          }}>{props.white ? '♖' : '♜'}</div>;       
      };

var Bishop = function (props) {
        return <div style={{
          fontSize:'65px',
          }}>{props.white ? '♗' : '♝'}</div>;       
      };

var Pawn = function (props) {
        return <div style={{
          fontSize:'65px',
          }}>{props.white ? '♙' : '♟'}</div>;       
      };

module.exports = {Knight: Knight
                 ,King: King
                 ,Queen: Queen
                 ,Rook: Rook
                 ,Bishop: Bishop
                 ,Pawn: Pawn
                };