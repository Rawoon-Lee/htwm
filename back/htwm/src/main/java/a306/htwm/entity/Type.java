package a306.htwm.entity;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

public enum Type {
    REQ_FRI,
    REQ_STR,
    ACC_FRI,
    ACC_STR,
    DEN_STR;
}
