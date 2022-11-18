package a306.htwm.service;

import a306.htwm.dto.*;
import a306.htwm.entity.*;
import a306.htwm.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Optional;

@Service
@Transactional(readOnly = true) // 기본은 false
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final MirrorRepository mirrorRepository;
    private final WeightRepository weightRepository;
    private final FriendRepository friendRepository;
    private final NoticeRepository noticeRepository;

    @Transactional
    public void register(RegisterDTO registerDTO) {
        User user = userRepository.findByUsername(registerDTO.getUsername());
        if(user == null) throw new RuntimeException("username 이 존재하지 않습니다.");
        Mirror mirror = mirrorRepository.findByUuid(registerDTO.getUuid());
        if(mirror==null){
            throw new RuntimeException("uuid 가 존재하지 않습니다.");
        }
        mirror.setUser(user);
    }

    @Transactional
    public void edit(EditDTO editDTO) {
        User user = userRepository.findByUsername(editDTO.getUsername());
        user.setImgUrl(editDTO.getUrl());
        user.setNickname(editDTO.getNickname());
        user.setHeight(editDTO.getHeight());
    }

    @Transactional
    public void weight(WeightDTO weightDTO) {
        LocalDate now = LocalDate.now(ZoneId.of("Asia/Seoul"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        String todayDate = now.format(formatter);

        Optional<Weight> weight = weightRepository.findByUsernameAndDate(weightDTO.getUsername(),todayDate);
        if(weight.isPresent()){
            weight.get().setWeight(weightDTO.getWeight());
        }else{
            User user = userRepository.findByUsername(weightDTO.getUsername());

            Weight newWeight = new Weight();
            newWeight.setWeight(weightDTO.getWeight());
            newWeight.setDate(todayDate);
            newWeight.setUser(user);
            weightRepository.save(newWeight);
        }
    }

    @Transactional
    public void acceptFriend(UsernameAndFriendDTO usernameAndFriendDTO) {
        Optional<Friend> friend = friendRepository.findByMyNameAndFriendName(usernameAndFriendDTO.getUsername(), usernameAndFriendDTO.getFriendname());
        if(friend.isPresent()){
            throw new RuntimeException("이미 친구입니다.");
        }else{
            Friend newFriend = new Friend();
            newFriend.setMyId(userRepository.findByUsername(usernameAndFriendDTO.getUsername()));
            newFriend.setOtherId(userRepository.findByUsername(usernameAndFriendDTO.getFriendname()));

            Friend newFriend2 = new Friend();
            newFriend2.setMyId(userRepository.findByUsername(usernameAndFriendDTO.getFriendname()));
            newFriend2.setOtherId(userRepository.findByUsername(usernameAndFriendDTO.getUsername()));

            friendRepository.save(newFriend);
            friendRepository.save(newFriend2);
        }
    }

    @Transactional
    public void deleteFriend(UsernameAndFriendDTO usernameAndFriendDTO) {
        Optional<Friend> friend = friendRepository.findByMyNameAndFriendName(usernameAndFriendDTO.getUsername(), usernameAndFriendDTO.getFriendname());
        if(friend.isPresent()){
            friendRepository.deleteById(friend.get().getId());

            Optional<Friend> friend2 = friendRepository.findByMyNameAndFriendName(usernameAndFriendDTO.getFriendname(), usernameAndFriendDTO.getUsername());
            friendRepository.deleteById(friend2.get().getId());
        }else{
            throw new RuntimeException("이미 친구가 아닙니다.");
        }
    }

    public ArrayList<FriendDTO> getFriend(String username) {
        if(userRepository.findByUsername(username) == null) throw new RuntimeException("username 이 존재하지 않습니다.");
        ArrayList<Friend> friends = friendRepository.findAllByUsername(username);
        ArrayList<FriendDTO> friendDTOS = new ArrayList<>();
        for(Friend friend : friends){
            FriendDTO friendDTO = FriendDTO.builder()
                    .username(friend.getOtherId().getUsername())
                    .nickname(friend.getOtherId().getNickname())
                    .url(friend.getOtherId().getImgUrl())
                    .phoneId(friend.getOtherId().getPhoneId())
                    .build();
            friendDTOS.add(friendDTO);
        }
        return friendDTOS;
    }

    public ArrayList<SearchDTO> searchFriend(String string, String username){
        ArrayList<User> users = userRepository.findByString(string);
        ArrayList<SearchDTO> friendInfoDTOS = new ArrayList<>();

        for(User user : users){
            /*
                0 - 신청 가능한 상태
                1 - 이미 친구임
                2 - 내가 신청 보낸 상태
                3 - 내가 신청 받은 상태
             */
            int status = 0;

            ArrayList<Notice> receivedNotice = noticeRepository.findByFromIdAndToIdIfTypeArr(user.getId(),userRepository.findByUsername(username).getId(),Type.REQ_FRI.toString());
            if(!receivedNotice.isEmpty()) {
                status = 3;
            }

            ArrayList<Notice> sentNotice = noticeRepository.findByFromIdAndToIdIfTypeArr(userRepository.findByUsername(username).getId(), user.getId(),Type.REQ_FRI.toString());
            if(!sentNotice.isEmpty()) {
                status = 2;
            }

            Optional<Friend> friends = friendRepository.findByMyIdAndFriendId(userRepository.findByUsername(username).getId(), user.getId());
            if(friends.isPresent()) status = 1;

            SearchDTO friendInfoDTO = SearchDTO.builder()
                    .nickname(user.getNickname())
                    .username(user.getUsername())
                    .url(user.getImgUrl())
                    .status(status)
                    .build();
            friendInfoDTOS.add(friendInfoDTO);
        }
        return friendInfoDTOS;
    }

    public String getUuid(String username){
        return mirrorRepository.findByUser(userRepository.findByUsername(username).getId()).getUuid();
    }

    public String getUsernameByUuid(String uuid) {
        return mirrorRepository.findByUuid(uuid).getUser().getUsername();
    }

    @Transactional
    public String login(LoginDTO loginDTO) {
        User user = userRepository.findByUsername(loginDTO.getUsername());
        if(user == null){
            User newUser = new User();
            newUser.setUsername(loginDTO.getUsername());
            newUser.setNickname(loginDTO.getNickname());
            newUser.setImgUrl(loginDTO.getUrl());
            newUser.setPhoneId(loginDTO.getPhoneId());
            userRepository.save(newUser);
            return "new user";
        }
        else{
            user.setPhoneId(loginDTO.getPhoneId());
            return "login";
        }
    }

    @Transactional
    public void height(HeightDTO heightDTO) {
        User user = userRepository.findByUsername(heightDTO.getUsername());
        if(user == null) throw new RuntimeException("no such user");
        user.setHeight(heightDTO.getHeight());
    }

    public UserInfoDTO info(String username) {
        User user = userRepository.findByUsername(username);
        if(user == null) throw new RuntimeException("no such user");
        UserInfoDTO ret = UserInfoDTO.builder()
                .height(user.getHeight())
                .url(user.getImgUrl())
                .nickname(user.getNickname())
                .build();
        return ret;
    }

    public User getUser(String username){
        return userRepository.findByUsername(username);
    }

    public ArrayList<WeightAndDateDTO> getWeight(String username) {
        ArrayList<Weight> weights = weightRepository.findByUsernameOrderByDate(username);
        ArrayList<WeightAndDateDTO> weightAndDateDTOS = new ArrayList<>();
        for(Weight weight : weights){
            WeightAndDateDTO weightAndDateDTO = WeightAndDateDTO.builder()
                    .date(weight.getDate())
                    .weight(weight.getWeight())
                    .build();
            weightAndDateDTOS.add(weightAndDateDTO);
        }
        return weightAndDateDTOS;
    }
}
