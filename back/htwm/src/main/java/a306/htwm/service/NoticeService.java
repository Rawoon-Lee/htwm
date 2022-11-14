package a306.htwm.service;

import a306.htwm.dto.NoticeDTO;
import a306.htwm.dto.UsernameAndFriendDTO;
import a306.htwm.entity.Notice;
import a306.htwm.entity.Type;
import a306.htwm.repository.FriendRepository;
import a306.htwm.repository.NoticeRepository;
import a306.htwm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Optional;

@Service
@Transactional(readOnly = true) // 기본은 false
@RequiredArgsConstructor
public class NoticeService {
    private final UserRepository userRepository;
    private final NoticeRepository noticeRepository;

    @Transactional
    public void addNotice(UsernameAndFriendDTO usernameAndFriendDTO, Type type){
        if(userRepository.findByUsername(usernameAndFriendDTO.getFriendname()) == null){
            throw new RuntimeException("친구의 username을 다시 확인하고 신청하세요.");
        }

        if(usernameAndFriendDTO.getFriendname().equals(usernameAndFriendDTO.getUsername())){
            throw new RuntimeException("자기 자신과 친구를 할 수 없습니다.");
        }

        Long userId = userRepository.findByUsername(usernameAndFriendDTO.getUsername()).getId();
        Long friendId = userRepository.findByUsername(usernameAndFriendDTO.getFriendname()).getId();

        /*
        String nowType = type.toString();
        if(noticeRepository.findByFromIdAndToIdIfType(userId,friendId,nowType).isPresent()){
            throw new RuntimeException("이미 해당 알림을 보냈습니다.");
        }
         */

        //Accept나 Deny 알림 : Request 읽음 처리
        if(type.equals(Type.ACC_FRI)){
            Optional<Notice> notice = noticeRepository.findByFromIdAndToIdIfType(friendId,userId,Type.REQ_FRI.toString());
            if(notice.isEmpty()){
                throw new RuntimeException("신청을 먼저 보내고 요청해주세요");
            }
            Notice realNotice = notice.get();
            realNotice.setIsread(true);
            noticeRepository.save(realNotice);
        }else if(type.equals(Type.ACC_STR)||type.equals(Type.DEN_STR)){
            Optional<Notice> notice = noticeRepository.findByFromIdAndToIdIfType(friendId,userId,Type.REQ_STR.toString());
            if(notice.isEmpty()){
                throw new RuntimeException("신청을 먼저 보내고 요청해주세요");
            }
            Notice realNotice = notice.get();
            realNotice.setIsread(true);
            noticeRepository.save(realNotice);
        }


        //notice 테이블 생성
        Notice notice = new Notice();
        notice.setFromId(userRepository.findByUsername(usernameAndFriendDTO.getUsername()));
        notice.setToId(userRepository.findByUsername(usernameAndFriendDTO.getFriendname()));
        notice.setType(type);
        notice.setCreateTime(LocalDateTime.now());
        notice.setIsread(false);

        noticeRepository.save(notice);
    }

    @Transactional
    public void read(String username){
        if(userRepository.findByUsername(username) == null){
            throw new RuntimeException("username이 존재하지 않습니다.");
        }
        Long userId = userRepository.findByUsername(username).getId();
        ArrayList<Notice> notices = noticeRepository.findAllByToId(userId);
        for(Notice notice : notices) {
            notice.setIsread(true);
        }
    }

    public ArrayList<NoticeDTO> getList(String username){
        Long userId = userRepository.findByUsername(username).getId();
        ArrayList<Notice> notices = noticeRepository.findAllByToId(userId);
        ArrayList<NoticeDTO> noticeDTOS = new ArrayList<>();
        for(Notice notice : notices){
            NoticeDTO noticeDTO = NoticeDTO.builder()
                    .notice_id(notice.getId())
                    .createTime(notice.getCreateTime())
                    .fromUsername(notice.getFromId().getUsername())
                    .toUsername(notice.getToId().getUsername())
                    .isRead(notice.isIsread())
                    .type(notice.getType())
                    .fromNickname(notice.getFromId().getNickname())
                    .toNickname(notice.getToId().getNickname())
                    .fromUrl(notice.getFromId().getImgUrl())
                    .fromPhoneId(notice.getFromId().getPhoneId())
                    .build();
            noticeDTOS.add(noticeDTO);
        }
        return noticeDTOS;
    }

    @Transactional
    public void readNoticeId(Long noticeId) {
        Notice notice = noticeRepository.findOneById(noticeId);
        if(notice == null) throw new RuntimeException("no such notice");
        notice.setIsread(true);
    }
}
