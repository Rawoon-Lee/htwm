package a306.htwm.entity;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

public enum Type {
    REQ_FRI, // 친구 요청
    REQ_STR, // 스트리밍 요청
    ACC_FRI, // 친구 수락
    ACC_STR, // 스트리밍 수락
    DEN_STR; // 스트리밍 거절
}
