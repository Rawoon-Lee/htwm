package a306.htwm.service;

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
        if(noticeRepository.findByFromIdAndToId(userId,friendId).isPresent()){
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
}
