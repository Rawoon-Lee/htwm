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

@Service
@Transactional(readOnly = true) // 기본은 false
@RequiredArgsConstructor
public class NoticeService {
    private final UserRepository userRepository;
    private final NoticeRepository noticeRepository;

    @Transactional
    public void requestFriend(UsernameAndFriendDTO usernameAndFriendDTO) {
        if(userRepository.findByUsername(usernameAndFriendDTO.getFriendname()) == null){
            throw new RuntimeException("친구의 username을 다시 확인하고 신청하세요.");
        }
        Long userId = userRepository.findByUsername(usernameAndFriendDTO.getUsername()).getId();
        Long friendId = userRepository.findByUsername(usernameAndFriendDTO.getFriendname()).getId();
        if(noticeRepository.findByFromIdAndToIdIfFriend(userId,friendId).isPresent()){
            throw new RuntimeException("이미 친구 신청을 보냈습니다.");
        }
        Notice notice = new Notice();
        notice.setFromId(userRepository.findByUsername(usernameAndFriendDTO.getUsername()));
        notice.setToId(userRepository.findByUsername(usernameAndFriendDTO.getFriendname()));
        notice.setType(Type.FRIEND);
        notice.setCreateTime(LocalDateTime.now());
        notice.setIsread(false);

        noticeRepository.save(notice);
    }

    @Transactional
    public void requestStreaming(UsernameAndFriendDTO usernameAndFriendDTO) {
        if(userRepository.findByUsername(usernameAndFriendDTO.getFriendname()) == null){
            throw new RuntimeException("친구의 username을 다시 확인하고 신청하세요.");
        }
        Long userId = userRepository.findByUsername(usernameAndFriendDTO.getUsername()).getId();
        Long friendId = userRepository.findByUsername(usernameAndFriendDTO.getFriendname()).getId();
        if(noticeRepository.findByFromIdAndToIdIfStreaming(userId,friendId).isPresent()){
            throw new RuntimeException("이미 스트리밍 신청을 보냈습니다.");
        }
        Notice notice = new Notice();
        notice.setFromId(userRepository.findByUsername(usernameAndFriendDTO.getUsername()));
        notice.setToId(userRepository.findByUsername(usernameAndFriendDTO.getFriendname()));
        notice.setType(Type.STREAMING);
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
                    .createTime(notice.getCreateTime())
                    .fromUsername(notice.getFromId().getUsername())
                    .toUsername(notice.getToId().getUsername())
                    .isRead(notice.isIsread())
                    .type(notice.getType())
                    .build();
            noticeDTOS.add(noticeDTO);
        }
        return noticeDTOS;
    }
}
