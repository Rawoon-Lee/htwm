package a306.htwm.controller;

import a306.htwm.dto.*;
import a306.htwm.entity.Friend;
import a306.htwm.entity.Type;
import a306.htwm.service.NoticeService;
import a306.htwm.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final NoticeService noticeService;

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterDTO registerDTO){
        try{
            userService.register(registerDTO);
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/edit")
    public ResponseEntity edit(@RequestBody EditDTO editDTO){
        try{
            userService.edit(editDTO);
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body("username 이 존재하지 않습니다.");
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/weight")
    public ResponseEntity weight(@RequestBody WeightDTO weightDTO){
        try{
            userService.weight(weightDTO);
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body("username 이 존재하지 않습니다.");
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/weight")
    public ResponseEntity<ArrayList<WeightAndDateDTO>> getWeight(@RequestParam("username") String username){
        try{
            return ResponseEntity.ok().body(userService.getWeight(username));
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/friend")
    public ResponseEntity acceptFriend(@RequestBody UsernameAndFriendDTO usernameAndFriendDTO){
        try{
            noticeService.addNotice(usernameAndFriendDTO, Type.ACC_FRI);
            userService.acceptFriend(usernameAndFriendDTO);
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/friend")
    public ResponseEntity deleteFriend(@RequestBody UsernameAndFriendDTO usernameAndFriendDTO){
        try{
            userService.deleteFriend(usernameAndFriendDTO);
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/friend")
    public ResponseEntity<ArrayList<FriendDTO>> getFriend(@RequestParam("username") String username){
        try {
            return ResponseEntity.ok().body(userService.getFriend(username));
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ArrayList<SearchDTO>> searchFriend(@RequestParam("nickname") String nickname, @RequestParam("username") String username){
        try {
            return ResponseEntity.ok().body(userService.searchFriend(nickname, username));
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }

    //get username by uuid
    @PostMapping("uuid")
    public ResponseEntity<String> getUsername(@RequestBody UuidDTO uuid){
        return ResponseEntity.ok().body(userService.getUsernameByUuid(uuid.getUuid()));
    }

    //get uuid by username
    @PostMapping("username")
    public ResponseEntity<String> getUuid(@RequestBody UsernameDTO usernameDTO){
        try {
            return ResponseEntity.ok().body(userService.getUuid(usernameDTO.getUsername()));
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body("null");
        }
    }


    @PostMapping("login")
    public ResponseEntity login(@RequestBody LoginDTO loginDTO){
        return ResponseEntity.ok().body(userService.login(loginDTO));
    }

    @PostMapping("height")
    public ResponseEntity height(@RequestBody HeightDTO heightDTO){
        try{
            userService.height(heightDTO);
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("info")
    public ResponseEntity<UserInfoDTO> info(@RequestParam("username") String username){
        UserInfoDTO ret = new UserInfoDTO();
        try{
            ret= userService.info(username);
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok().body(ret);
    }
}
