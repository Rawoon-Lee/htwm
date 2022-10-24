package a306.htwm.service;

import a306.htwm.dto.UsernameAndFriendDTO;
import a306.htwm.repository.StreamingRepository;
import a306.htwm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true) // 기본은 false
@RequiredArgsConstructor
public class StreamingService {

    final private StreamingRepository streamingRepository;
    final private UserRepository userRepository;

    public void accept(UsernameAndFriendDTO usernameAndFriendDTO) {
        if(userRepository.findByUsername(usernameAndFriendDTO.getUsername())==null){
            throw new RuntimeException("username이 없습니다.");
        }
        if(userRepository.findByUsername(usernameAndFriendDTO.getFriendname())==null){
            throw new RuntimeException("친구의 username이 없습니다.");
        }

    }
}
