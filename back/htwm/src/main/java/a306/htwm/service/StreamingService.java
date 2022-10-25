package a306.htwm.service;

import a306.htwm.dto.RecordRoutineDTO;
import a306.htwm.dto.StreamingDTO;
import a306.htwm.dto.UsernameAndFriendDTO;
import a306.htwm.entity.Record;
import a306.htwm.entity.Streaming;
import a306.htwm.repository.NoticeRepository;
import a306.htwm.repository.StreamingRepository;
import a306.htwm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

@Service
@Transactional(readOnly = true) // 기본은 false
@RequiredArgsConstructor
public class StreamingService {

    final private StreamingRepository streamingRepository;
    final private UserRepository userRepository;
    final private NoticeRepository noticeRepository;

    public void accept(UsernameAndFriendDTO usernameAndFriendDTO) {
        if(userRepository.findByUsername(usernameAndFriendDTO.getUsername())==null){
            throw new RuntimeException("username이 없습니다.");
        }
        if(userRepository.findByUsername(usernameAndFriendDTO.getFriendname())==null){
            throw new RuntimeException("친구의 username이 없습니다.");
        }
    }

    @Transactional
    public void end(UsernameAndFriendDTO usernameAndFriendDTO){

        Long userId = userRepository.findByUsername(usernameAndFriendDTO.getUsername()).getId();
        Long friendId = userRepository.findByUsername(usernameAndFriendDTO.getFriendname()).getId();

        LocalDateTime start = noticeRepository.findTimeByLastType(userId,friendId,"ACC_STR").getCreateTime();
        LocalDateTime end = LocalDateTime.now();

        //중복 end exception
        Optional<Streaming> streaming = streamingRepository.findLastOneByPlayers(userId,friendId);
        if(streaming.isPresent() && streaming.get().getStartTime().equals(start)){
            throw new RuntimeException("이미 끝난 스트리밍입니다.");
        }

        //나
        Streaming myStreaming = new Streaming();
        myStreaming.setMyId(userRepository.findByUsername(usernameAndFriendDTO.getUsername()));
        myStreaming.setOtherId(userRepository.findByUsername(usernameAndFriendDTO.getFriendname()));
        myStreaming.setStartTime(start);
        myStreaming.setEndTime(end);

        //상대
        Streaming otherStreaming = new Streaming();
        otherStreaming.setMyId(userRepository.findByUsername(usernameAndFriendDTO.getFriendname()));
        otherStreaming.setOtherId(userRepository.findByUsername(usernameAndFriendDTO.getUsername()));
        otherStreaming.setStartTime(start);
        otherStreaming.setEndTime(end);

        streamingRepository.save(myStreaming);
        streamingRepository.save(otherStreaming);
    }

    public ArrayList<StreamingDTO> getList(String username) {
        Long userId = userRepository.findByUsername(username).getId();
        ArrayList<Streaming> streamings = streamingRepository.findAllByUserId(userId);
        ArrayList<StreamingDTO> streamingDTOS=new ArrayList<>();
        for(Streaming streaming : streamings){
            StreamingDTO streamingDTO = StreamingDTO.builder()
                    .otherUsername(streaming.getOtherId().getUsername())
                    .otherNickname(streaming.getOtherId().getNickname())
                    .startTime(streaming.getStartTime())
                    .endTime(streaming.getEndTime())
                    .build();
            streamingDTOS.add(streamingDTO);
        }
        return streamingDTOS;
    }
}
